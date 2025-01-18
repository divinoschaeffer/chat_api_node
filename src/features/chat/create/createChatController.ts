import {Request, Response} from "express";
import {AlreadyExistsError} from "../../../utils/AlreadyExistsError";
import createChatSchema from "../../../validationSchema/createChatSchema";
import {handleCreateChat} from "./createChatService";
import {Chat} from "../../../models/Chat";

export const createChat = async (req: Request, res: Response): Promise<void> => {
    const schema = req.body;

    try {
        const result = await createChatSchema.validateAsync(schema);
        const chat: Chat = await handleCreateChat(result);
        res.json(chat);
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