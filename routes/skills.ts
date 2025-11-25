import express from 'express';
import { getSkills, addSkill, updateSkill, deleteSkill } from '../database';
import { Skill } from '../interfaces/Skill';
import {authenticateToken} from "../jwtMiddleware";

const router = express.Router();

// ---------- Get all skills ----------
router.get('/', async (_req, res) => {
    try {
        const skills = await getSkills();
        res.json(skills);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch skills' });
    }
});

// ---------- Add a new skill ----------
router.post('/', authenticateToken, async (req, res) => {
    try {
        const skill: Omit<Skill, 'id' | 'created_at' | 'updated_at'> = req.body;
        const newSkill = await addSkill(skill);
        res.json({ id: newSkill.id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to add skill' });
    }
});

// ---------- Update an existing skill ----------
router.put('/:id', authenticateToken, async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const skill: Partial<Skill> = req.body;
        const updatedSkill = await updateSkill(id, skill);
        res.json({ updated: !!updatedSkill });
    } catch (err: any) {
        console.error(err);
        if (err.code === 'P2025') { // Prisma "record not found"
            res.status(404).json({ error: 'Skill not found' });
        } else {
            res.status(500).json({ error: 'Failed to update skill' });
        }
    }
});

// ---------- Delete a skill ----------
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        await deleteSkill(id);
        res.json({ deleted: true });
    } catch (err: any) {
        console.error(err);
        if (err.code === 'P2025') {
            res.status(404).json({ error: 'Skill not found' });
        } else {
            res.status(500).json({ error: 'Failed to delete skill' });
        }
    }
});

export default router;