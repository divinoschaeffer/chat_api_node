import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const authenticateToken = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const token = req.header("Authorization")?.split(" ")[1];
    const privateKey = process.env.PRIVATE_KEY;

    if (!privateKey) {
        return res.status(500).json({ message: "ENV not set" });
    }

    if (!token) {
        return res.status(401).json({ message: "Access denied, token missing" });
    }

    jwt.verify(token, privateKey, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: "Invalid token" });
        }

        req.user = 5;
        next();
    });
};
