import express, {RequestHandler} from "express";
import jwt, { SignOptions } from "jsonwebtoken";
import bcrypt from "bcryptjs";
import {addOrUpdateKeyValue, getValueByKey, getValuesByKeys} from "../database";
import nodemailer from "nodemailer";
import {renderToStaticMarkup} from "react-dom/server";
import React from "react";
import NewPasswordTemplate from "../templates/NewPasswordTemplate";
import crypto from "crypto";
import {authenticateToken, AuthRequest} from "../jwtMiddleware";

const router = express.Router();

// Read JWT secret and expiration from env
const secret = process.env.JWT_SECRET;
const env = process.env.NODE_ENV;
const expiresIn = "1d";

const generatePassword = (length: number = 12) => {
    return crypto.randomBytes(length)
        .toString("base64")
        .slice(0, length);
};


// Ensure JWT secret exists
if (!secret) {
    throw new Error("JWT_SECRET is not set in environment variables!");
}

router.post("/login", async (req, res) => {
    const {username, password} = req.body;

    // Input validation
    if (!username || !password) {
        return res.status(400).json({title: "Bad Request", message: "Username and password are required"});
    }

    const user = await getValuesByKeys(["username", "password"]);

    // Check credentials
    if (!user || username !== user.username || !bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({title: "Access Denied", message: "Invalid credentials"});
    }

    try {
        const token = jwt.sign(
            {
                isAdmin: true,
                username: user.username
            },
            secret,
            {expiresIn} as SignOptions
        );

        // Decode token to get expiration timestamp
        const decoded = jwt.decode(token) as { exp: number } | null;

        if (!decoded || !decoded.exp) {
            return res.status(500).json({title: "Error", message: "Error generating token"});
        }

        const expirationTimestamp = decoded.exp * 1000; // milliseconds
        const maxAge = expirationTimestamp - Date.now();

        // Send token in HttpOnly cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: env === "production",
            sameSite: env === "production" ? "none" : "strict",
            maxAge: maxAge > 0 ? maxAge : 24 * 60 * 60 * 1000
        });

        res.json({
            status: "OK",
            message: "Logged in successfully",
            tokenExpiration: expirationTimestamp,
            isAdmin: true,
            username: user.username
        });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({message: "Internal server error"});
    }
});


router.post("/reset-password",async (req, res) => {

    if (!req.body?.username) {
        return res.status(400).json({title: "Bad Request", message: "Username is required"});
    }

    const username = (await getValueByKey("username"))?.value;

    if(!username || username !== req.body?.username){
        return res.status(401).json({title: "Access Denied", message: "Invalid username"});
    }

    const newPassword = generatePassword();

    try {

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
        });

        const htmlContent = renderToStaticMarkup(
            React.createElement(NewPasswordTemplate, {
                name:username,newPassword:newPassword
            })
        );

        const mailOptions = {
            from: `"Portfolio " <${process.env.MAIL_USER}>`,
            to: process.env.MY_EMAIL,
            subject: `📩 New Password`,
            html: htmlContent,
        };

        await transporter.sendMail(mailOptions);
        await addOrUpdateKeyValue("password",bcrypt.hashSync(newPassword, 10));

        res.status(200).json({ title: "Reset Password", message: "Password updated successfully, check your email" });
    } catch (error) {
        console.error("Email Error:", error);
        res.status(500).json({ error: "Could not send email" });
    }
});

const isAuthenticatedHandler: RequestHandler = (req: AuthRequest, res) => {
    return res.status(200).json({
        authenticated: true,
        username: req.user?.username || null,
        isAdmin: req.user?.isAdmin ?? false,
        timestamp: Date.now(),
        message: "The admin is authenticated"
    });
};

router.get('/isAuthenticated', authenticateToken, isAuthenticatedHandler);

export default router;
