import {Message} from "../../../models/Message";
import {count, list} from "../../../repositories/messageRepository";
import {Chat} from "../../../models/Chat";
import {getChatById} from "../../../repositories/chatRepository";
import {RessourceNotFoundError} from "../../../utils/RessourceNotFoundError";
import {PublicUserDTO} from "../../../models/PublicUserDTO";

export const handleListingMessage = async (userId: number, chatId: number, limit: number, offset: number): Promise<{total: number, messages: Message[]}> => {
    const chat: Chat|null = await getChatById(chatId);

    if (chat === null) {
        throw new RessourceNotFoundError("Chat with id: " + chatId + " not found");
    }

    let valid = true;
    chat.users.map((user: PublicUserDTO) => {
        if (user.id == userId) {
            valid = true;
        }
    });

    if (!valid) {
        throw new RessourceNotFoundError("Chat with id: " + chatId + " not found")
    }

    const messages: Message[] = await list(chatId, limit, offset);
    const total: number = await count(chatId);

    return {total, messages}
}