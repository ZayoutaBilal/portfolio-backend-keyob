import express from 'express';
import {
    getExperiences,
    addExperience,
    updateExperience,
    deleteExperience,
} from '../database';
import {authenticateToken} from "../jwtMiddleware";

const router = express.Router();

// ---------- Get all experiences ----------
router.get('/', async (_req, res) => {
    try {
        const experiences = await getExperiences();
        res.json(experiences);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch experiences' });
    }
});

// ---------- Add a new experience ----------
router.post('/', authenticateToken, async (req, res) => {
    try {
        const exp = req.body;
        const newExp = await addExperience(exp);
        res.json({ id: newExp.id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to add experience' });
    }
});

// ---------- Update an existing experience ----------
router.put('/:id', authenticateToken, async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const exp = req.body;
        const updatedExp = await updateExperience(id, exp);
        res.json({ updated: !!updatedExp });
    } catch (err: any) {
        console.error(err);
        if (err.code === 'P2025') { // Prisma "record not found" error
            res.status(404).json({ error: 'Experience not found' });
        } else {
            res.status(500).json({ error: 'Failed to update experience' });
        }
    }
});

// ---------- Delete an experience ----------
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        await deleteExperience(id);
        res.json({ deleted: true });
    } catch (err: any) {
        console.error(err);
        if (err.code === 'P2025') { // Prisma "record not found" error
            res.status(404).json({ error: 'Experience not found' });
        } else {
            res.status(500).json({ error: 'Failed to delete experience' });
        }
    }
});

export default router;
