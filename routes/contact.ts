import express from "express";
import nodemailer from "nodemailer";
import {Message} from "../interfaces/Message";
import {renderToStaticMarkup} from "react-dom/server";
import ContactEmailTemplate from "../templates/ContactEmailTemplate";
import React from "react";

const router = express.Router();

router.post("/", async (req, res) => {
    const { name, email, subject, message } = req.body as Message;

    if (!name || !email || !subject || !message) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
        });

        const htmlContent = renderToStaticMarkup(
            React.createElement(ContactEmailTemplate, {
                name: name,
                email: email,
                subject: subject,
                message: message
            })
        );

        const mailOptions = {
            from: `"Portfolio Message" <${process.env.MAIL_USER}>`,
            to: process.env.MY_EMAIL,
            subject: `📩 New message from ${name}: ${subject}`,
            html: htmlContent,
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ success: "Message sent successfully" });
    } catch (error) {
        console.error("Email Error:", error);
        res.status(500).json({ error: "Could not send email" });
    }
});

export default router;
