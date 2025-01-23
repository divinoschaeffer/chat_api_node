import {getChatById, softDelete} from "../../../repositories/chatRepository";
import {Chat} from "../../../models/Chat";
import {RessourceNotFoundError} from "../../../utils/RessourceNotFoundError";

export const handleDeleteChat = async (chatId: number): Promise<void> => {
    const chat: Chat|null = await getChatById(chatId);

    if (chat === null) {
        throw new RessourceNotFoundError("Chat with id: " + chatId + " not found");
    }

    await softDelete(chatId);
}