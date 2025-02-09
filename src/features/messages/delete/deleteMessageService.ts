import {Message} from "../../../models/Message";
import {getMessageById, softDelete} from "../../../repositories/messageRepository";
import {RessourceNotFoundError} from "../../../utils/RessourceNotFoundError";
import {UnauthorizedActionError} from "../../../utils/UnauthorizedActionError";

export const handleDeleteMessage = async (userId: number, messageId: number): Promise<void> => {
    const message: Message|null = await getMessageById(messageId);

    if (message === null) {
        throw new RessourceNotFoundError('message with id: ' + messageId + ' not found');
    }

    if (message.sender_id != userId) {
        throw new UnauthorizedActionError("Cannot delete message, authenticate user is not sender");
    }

    await softDelete(messageId);
}