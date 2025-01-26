import {Message} from "../../../models/Message";
import {getMessageById, softDelete} from "../../../repositories/messageRepository";
import {RessourceNotFoundError} from "../../../utils/RessourceNotFoundError";

export const handleDeleteMessage = async (messageId: number): Promise<void> => {
    const message: Message|null = await getMessageById(messageId);

    if (message === null) {
        throw new RessourceNotFoundError('message with id: ' + messageId + ' not found');
    }

    await softDelete(messageId);
}