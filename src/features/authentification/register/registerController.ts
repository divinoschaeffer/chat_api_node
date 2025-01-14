import {Request, Response} from "express";
import createUserSchema from "../../../validationSchema/createUserSchema";
import {handleRegister} from "./registerService";

export const register = async (req: Request, res: Response) => {
    const schema = req.body;
    try {
        const result:any = await createUserSchema.validateAsync(schema);
        const user = handleRegister(result)
        res.send("Hey heu");
    } catch (error: any) {
        if (error.isJoi) {
            res.status(400).json({ message: "Bad Request", details: error.details });
        } else {
            res.status(500).json({ message: "Internal server error", error: error.message });
        }
    }
}
