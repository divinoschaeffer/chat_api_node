import {Request, Response} from "express";
import createUserSchema from "../../../validationSchema/createUserSchema";
import {handleRegister} from "./registerService";
import {handleCreateToken} from "../token/createTokenService";
import {User} from "../../../models/User";
import {AlreadyExistsError} from "../../../utils/AlreadyExistsError";
import {createDtoFromUser} from "../../../models/UserDTO";

export const register = async (req: Request, res: Response): Promise<void> => {
    const schema = req.body;

    try {
        const result: any = await createUserSchema.validateAsync(schema);
        const user: User = await handleRegister(result)
        const token: string = handleCreateToken(user.id!);
        res.json({
            'user': createDtoFromUser(user),
            'token': token
        });
    } catch (error: any) {
        if (error.isJoi) {
            res.status(400).json({ message: "Bad Request", details: error.message});
        } else if (error instanceof AlreadyExistsError) {
            res.status(403).json({ message: "Resource already exist", details: error.message});
        } else {
            res.status(500).json({ message: "Internal server error", error: error.message });
        }
    }
}
