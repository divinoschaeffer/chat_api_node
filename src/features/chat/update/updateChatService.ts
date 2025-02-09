import {Chat} from "../../../models/Chat";
import {getChatById, update} from "../../../repositories/chatRepository";
import {RessourceNotFoundError} from "../../../utils/RessourceNotFoundError";
import {UnauthorizedActionError} from "../../../utils/UnauthorizedActionError";

export const handleUpdateChat = async (userId: number, chatId: number, values: any): Promise<Chat> => {
    const chat: Chat|null = await getChatById(chatId);

    if (chat === null) {
        throw new RessourceNotFoundError("Chat with id: " + chatId + " not found");
    }

    chat.name = values.name;

    if (chat.creator_id !== userId) {
        throw new UnauthorizedActionError("Cannot update chat if not creator");
    }

    await update(chat);

    return chat;
}
