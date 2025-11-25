import express from 'express';
import {
    getProjects,
    addProject,
    updateProject,
    deleteProject,
} from '../database';
import {authenticateToken} from "../jwtMiddleware";

const router = express.Router();

// ---------- Get all projects ----------
router.get('/', async (_req, res) => {
    try {
        const projects = await getProjects();
        res.json(projects);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch projects' });
    }
});

// ---------- Add a new project ----------
router.post('/', authenticateToken, async (req, res) => {
    try {
        const proj = req.body;
        const newProj = await addProject(proj);
        res.json({ id: newProj.id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to add project' });
    }
});

// ---------- Update an existing project ----------
router.put('/:id', authenticateToken, async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const proj = req.body;
        const updatedProj = await updateProject(id, proj);
        res.json({ updated: !!updatedProj });
    } catch (err: any) {
        console.error(err);
        if (err.code === 'P2025') {
            res.status(404).json({ error: 'Project not found' });
        } else {
            res.status(500).json({ error: 'Failed to update project' });
        }
    }
});

// ---------- Delete a project ----------
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        await deleteProject(id);
        res.json({ deleted: true });
    } catch (err: any) {
        console.error(err);
        if (err.code === 'P2025') {
            res.status(404).json({ error: 'Project not found' });
        } else {
            res.status(500).json({ error: 'Failed to delete project' });
        }
    }
});

export default router;
