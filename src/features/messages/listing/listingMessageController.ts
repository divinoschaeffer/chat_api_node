import {Response, Request} from "express";
import {handleListingMessage} from "./listingMesssageService";

export const listingMessageController = async  (req: Request, res: Response): Promise<void> => {
    const chatId: number = parseInt(req.params.chatId);
    const limit: number = req.query.limit ? parseInt(<string>req.query.limit) : 0;
    const offset: number = req.query.offset ? parseInt(<string>req.query.offset) : 0;

    if (isNaN(chatId)) {
        res.status(400).json({ message: "Invalid chat ID. Must be a number." });
        return;
    }

    try {
        const {total, messages} = await handleListingMessage(chatId, limit, offset);
        res.json({
            total_count: total,
            items: messages
        })
    } catch (error: any) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}
