import {Request, Response} from "express";
import {RessourceNotFoundError} from "../../../utils/RessourceNotFoundError";
import {handleDeleteChat} from "./deleteChatService";

export const deleteChat = async (req: Request, res: Response): Promise<void> => {
    const chatId: number = parseInt(req.params.chatId);
    const userId: number = req.user!;

    if (isNaN(chatId)) {
        res.status(400).json({ message: "Invalid chat ID. Must be a number." });
        return;
    }

    try {
        await handleDeleteChat(userId, chatId)
        res.status(204).json({ message: "Chat deleted"});
    } catch (error: any) {
        if (error instanceof RessourceNotFoundError) {
            res.status(404).json({ message: "Resource not found", details: error.message});
        } else {
            res.status(500).json({ message: "Internal server error", error: error.message });
        }
    }
}