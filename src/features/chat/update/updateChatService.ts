import {Chat} from "../../../models/Chat";
import {getChatById, update} from "../../../repositories/chatRepository";
import {RessourceNotFoundError} from "../../../utils/RessourceNotFoundError";

export const handleUpdateChat = async (chatId: number, values: any): Promise<Chat> => {
    const chat: Chat|null = await getChatById(chatId);

    if (chat === null) {
        throw new RessourceNotFoundError("Chat with id: " + chatId + " not found");
    }

    chat.name = values.name;

    await update(chat);

    return chat;
}
