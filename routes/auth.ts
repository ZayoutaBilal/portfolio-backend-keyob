import express from "express";
import jwt, { SignOptions } from "jsonwebtoken";
import bcrypt from "bcryptjs";
import {getValuesByKeys} from "../database";

const router = express.Router();

// const user = {
//     username: "bilal",
//     password: bcrypt.hashSync("123", 10),
// };

// Read JWT secret and expiration from env
const secret = process.env.JWT_SECRET;
const expiresIn = "1d";

// Ensure JWT secret exists
if (!secret) {
    throw new Error("JWT_SECRET is not set in environment variables!");
}

// Login route
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
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
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

export default router;
