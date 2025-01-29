import {Chat} from "../../../models/Chat";
import {getAllChat} from "../../../repositories/userRepository";

export const handleGetUserChats = async (userId: number): Promise<Chat[]> => {
    const chats: Chat[] = await getAllChat(userId);

    return chats;
}
