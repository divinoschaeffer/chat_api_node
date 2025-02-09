import {getChatById, softDelete} from "../../../repositories/chatRepository";
import {Chat} from "../../../models/Chat";
import {RessourceNotFoundError} from "../../../utils/RessourceNotFoundError";
import {UnauthorizedActionError} from "../../../utils/UnauthorizedActionError";

export const handleDeleteChat = async (userId: number, chatId: number): Promise<void> => {
    const chat: Chat|null = await getChatById(chatId);

    if (chat === null) {
        throw new RessourceNotFoundError("Chat with id: " + chatId + " not found");
    }

    if (chat.creator_id !== userId) {
        throw new UnauthorizedActionError("Cannot delete chat if not chat creator");
    }

    await softDelete(chatId);
}