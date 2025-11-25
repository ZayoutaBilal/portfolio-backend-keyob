import express from 'express';
import {
    addOrUpdateKeyValue,
    deleteKeyValue,
    getAllKeyValues,
    getValueByKey,
} from '../database';
import {authenticateToken} from "../jwtMiddleware";

const router = express.Router();

// ---------- Get all key-values ----------
router.get('/', async (_req, res) => {
    try {
        const data = await getAllKeyValues();
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch key-values' });
    }
});

// ---------- Get value by key ----------
router.get('/:key', authenticateToken, async (req, res) => {
    try {
        const key = req.params.key;
        const data = await getValueByKey(key);
        if (!data) return res.status(404).json({ error: 'Key not found' });
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch value' });
    }
});

// ---------- Add or update a key-value ----------
router.post('/', authenticateToken, async (req, res) => {
    try {
        const { key, value } = req.body;
        if (!key || value === undefined) {
            return res.status(400).json({ error: 'Key and value are required' });
        }
        const kv = await addOrUpdateKeyValue(key, value);
        res.json(kv);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to add or update key-value' });
    }
});

// ---------- Delete a key-value ----------
router.delete('/:key', authenticateToken, async (req, res) => {
    try {
        const key = req.params.key;
        await deleteKeyValue(key);
        res.json({ deleted: true });
    } catch (err: any) {
        console.error(err);
        if (err.code === 'P2025') {
            res.status(404).json({ error: 'Key not found' });
        } else {
            res.status(500).json({ error: 'Failed to delete key-value' });
        }
    }
});


export default router;
