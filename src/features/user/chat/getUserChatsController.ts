import {Response, Request} from "express";
import {handleGetUserChats} from "./getUserChatsService";
import {Chat} from "../../../models/Chat";

export const getUserChatsController = async (req: Request, res: Response): Promise<void> => {
    const userId: number = parseInt(req.params.user_id);

    if (isNaN(userId)) {
        res.status(400).json({message: "Params user_id undefined"});
    }

    try {
        const chats: Chat[] = await handleGetUserChats(userId);
        res.status(200).json(chats);
    } catch (error: any) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}