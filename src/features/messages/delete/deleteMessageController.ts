import {Response, Request} from "express";
import {handleDeleteMessage} from "./deleteMessageService";

export const deleteMessageController = async (req: Request, res: Response): Promise<void> => {
    const messageId: number = parseInt(req.params.messageId);
    const userId: number = req.user!;

    if (isNaN(messageId)) {
        res.status(400).json({ message: "Invalid message ID. Must be a number." });
        return;
    }

    try {
        await handleDeleteMessage(userId, messageId);
        res.status(204).json({message: "message deleted"});
    } catch (error: any) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}