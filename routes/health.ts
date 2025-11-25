import express from "express";

const router = express.Router();

router.get('/isAwake', async (_req, res) => {
    res.status(200).json({ status: "OK", timestamp: Date.now() , message:"Api service is awake"});
});

export default router;