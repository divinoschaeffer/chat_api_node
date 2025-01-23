import {Request, Response} from "express";
import {RessourceNotFoundError} from "../../../utils/RessourceNotFoundError";
import updateChatSchema from "../../../validationSchema/updateChatSchema";
import {Chat} from "../../../models/Chat";
import {handleUpdateChat} from "./updateChatService";

export const updateChat = async (req: Request, res: Response): Promise<void> => {
    const chatId = parseInt(req.params.chatId);
    const updateBody = req.body;

    if (isNaN(chatId)) {
        res.status(400).json({ message: "Invalid chat ID. Must be a number." });
        return;
    }

    try {
        const result = await updateChatSchema.validateAsync(updateBody);
        const chat: Chat = await handleUpdateChat(chatId, result);
        res.status(200).json(chat);
    } catch (error: any) {
        if (error.isJoi) {
            res.status(400).json({ message: "Bad Request", details: error.message});
        } else if (error instanceof RessourceNotFoundError) {
            res.status(404).json({ message: "Resource not found", details: error.message});
        } else {
            res.status(500).json({ message: "Internal server error", error: error.message });
        }
    }
}
