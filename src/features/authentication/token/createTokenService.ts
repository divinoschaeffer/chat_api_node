import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config()

export const handleCreateToken = (userId: number): string => {
    const privateKey = process.env.PRIVATE_KEY;

    if (!privateKey) {
        throw new Error("PRIVATE_KEY not set");
    }

    return jwt.sign({
        data: userId,
    }, privateKey, {'expiresIn': '1d'});
}
