import {Chat} from "../../../models/Chat";
import {getChatById} from "../../../repositories/chatRepository";
import {RessourceNotFoundError} from "../../../utils/RessourceNotFoundError";
import {PublicUserDTO} from "../../../models/PublicUserDTO";

export const handleGetChat = async (userId: number, chatId: number): Promise<Chat> => {
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

    return chat;
}