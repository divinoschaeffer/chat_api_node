import {Chat} from "../../../models/Chat";
import {getChatById} from "../../../repositories/chatRepository";
import {RessourceNotFoundError} from "../../../utils/RessourceNotFoundError";

export const handleGetChat = async (chatId: number): Promise<Chat> => {
    const chat: Chat|null = await getChatById(chatId);

    if (chat === null) {
        throw new RessourceNotFoundError("Chat with id: " + chatId + " not found");
    }

    return chat;
}