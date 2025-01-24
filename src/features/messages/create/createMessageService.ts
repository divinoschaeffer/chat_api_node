import {Chat} from "../../../models/Chat";
import {RessourceNotFoundError} from "../../../utils/RessourceNotFoundError";
import {Message} from "../../../models/Message";
import {getChatById} from "../../../repositories/chatRepository";
import {store} from "../../../repositories/messageRepository"

export const handleCreateMessage = async (chatId: number, result: any, files: Express.Multer.File[]): Promise<Message> => {
    const chat: Chat|null = await getChatById(chatId);

    if (chat === null) {
        throw new RessourceNotFoundError("Chat with id: " + chatId + " not found");
    }

    const images: string[] = files.map((file) => file.path)

    let message: Message = new Message(
        null,
        result.sender,
        chatId,
        result.content,
        images,
        new Date(),
        null
    )

    return await store(message);
}
