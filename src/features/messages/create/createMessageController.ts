import {Response, Request} from "express";
import createMessageSchema from "../../../validationSchema/createMessageSchema";
import {handleCreateMessage} from "./createMessageService";
import {RessourceNotFoundError} from "../../../utils/RessourceNotFoundError";
import {Message} from "../../../models/Message";

export const createMessage = async (req: Request, res: Response): Promise<void> => {
    const chatId: number = parseInt(req.params.chatId);
    const messageBody = req.body;
    const files = req.files as Express.Multer.File[] ?? [];

    if (isNaN(chatId)) {
        res.status(400).json({ message: "Invalid chat ID. Must be a number." });
        return;
    }

    try {
        const result = await createMessageSchema.validateAsync(messageBody);
        const message: Message = await handleCreateMessage(chatId, result, files);
        res.status(201).json(message);
    } catch (error: any) {
        if (error.isJoi) {
            res.status(400).json({ message: "Bad Request", details: error.message});
        } else if (error instanceof RessourceNotFoundError) {
            res.status(404).json({ message: "Ressource not found", error: error.message });
        } else {
            res.status(500).json({ message: "Internal server error", error: error.message });
        }
    }
}
