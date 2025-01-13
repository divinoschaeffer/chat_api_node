import {Request, Response} from "express";
import createUserSchema from "../../../validationSchema/createUserSchema";

export const register = async (req: Request, res: Response) => {
    const schema = req.body;
    try {
        const value = await createUserSchema.validateAsync(schema);
        res.send("Hey heu");
    } catch (error: any) {
        if (error.isJoi) {
            res.status(400).json({ message: "Bad Request", details: error.details });
        } else {
            res.status(500).json({ message: "Internal server error", error: error.message });
        }
    }
}
