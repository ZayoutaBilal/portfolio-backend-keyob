import {NextFunction, Request, Response} from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
    user?: { isAdmin: boolean, username: string };
}

export function authenticateToken(req: AuthRequest, res: Response, next: NextFunction) {
    const token = req.cookies.token;

    if (!token) return res.status(401).json({ message: "Token missing" });

    try {
        const secret = process.env.JWT_SECRET!;
        req.user = jwt.verify(token, secret) as { isAdmin: boolean, username: string };
        next();
    } catch (err) {
        return res.status(403).json({ message: "Token invalid or expired" });
    }
}
