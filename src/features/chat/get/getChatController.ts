import {Request, Response} from "express";
import {Chat} from "../../../models/Chat";
import {handleGetChat} from "./getChatService";
import {RessourceNotFoundError} from "../../../utils/RessourceNotFoundError";

export const getChat = async (req: Request, res: Response): Promise<void> => {
    const chatId: number = parseInt(req.params.chatId);
    const userId: number = req.user!;

    if (isNaN(chatId)) {
        res.status(400).json({ message: "Invalid chat ID. Must be a number." });
        return;
    }

    try {
        const chat: Chat = await handleGetChat(userId, chatId);
        res.json(chat);
    } catch (error: any) {
        if (error instanceof RessourceNotFoundError) {
            res.status(404).json({ message: "Resource not found", details: error.message});
        } else {
            res.status(500).json({ message: "Internal server error", error: error.message });
        }
    }
}
