import {Request, Response} from "express";
import loginSchema from "../../../validationSchema/loginSchema";
import {handleLogin} from "./loginService";
import {handleCreateToken} from "../token/createTokenService";
import {createDtoFromUser} from "../../../models/UserDTO";
import {RessourceNotFoundError} from "../../../utils/RessourceNotFoundError";

export const login = async (req: Request, res: Response): Promise<void> => {
    const schema = req.body;

    try {
        const result: any = await loginSchema.validateAsync(schema);
        const user =  await handleLogin(result);
        const token: string = handleCreateToken(user.id!);
        res.json({
            'user': createDtoFromUser(user),
            'token': token
        })
    } catch (error: any) {
        if (error.isJoi) {
            res.status(400).json({ message: "Bad Request", details: error.message });
        } else if (error instanceof RessourceNotFoundError) {
            res.status(404).json({ message: "Ressource not found", details: error.message })
        } else {
            res.status(500).json({ message: "Internal server error", error: error.message });
        }
    }
}
