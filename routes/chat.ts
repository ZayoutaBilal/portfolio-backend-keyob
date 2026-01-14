import Groq from "groq-sdk";
import express from "express";
import resume from "../data/resume.json";

const router = express.Router();

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

router.post("/", async (req, res) => {
    const { question } = req.body;

    const completion = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
            {
                role: "system",
                content: `You are Bilal's portfolio assistant. Your job is to answer questions about Bilal's professional experience, skills, and projects in a friendly, conversational way.

                        RULES:
                        - Answer questions using ONLY the information from the CV JSON provided
                        - Be concise and natural - avoid listing everything unless asked
                        - If asked about something not in the CV, politely say "I don't have information" and suggest related topics you can help with
                        - Highlight relevant accomplishments and technologies when appropriate
                        - Use a professional but friendly tone
                        - Don't mention "CV JSON" or technical details about how you work
                        - Don't list all capabilities unprompted - wait for specific questions
                        - Answer like you are Bilal for UX.
                        
                        CV DATA:
                        ${JSON.stringify(resume, null, 2)}`
            },
            {
                role: "user",
                content: question
            }
        ],
        temperature: 0.3,
    });

    res.json({
        answer: completion.choices[0].message.content
    });
});

export default router;