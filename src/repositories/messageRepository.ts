import {Message} from "../models/Message";
import database from "../database";

export const store = async (message: Message): Promise<Message> => {
    return await database.transaction(async (trx) => {
        try {
            const [messageId]: number[] = await trx<Message>('messages')
                .insert({
                    sender_id: message.sender_id,
                    content: message.content,
                    chat_id: message.chat_id,
                    created_at: message.created_at
                }, 'id');

            for (const img of message.images) {
                await trx('images_messages')
                    .insert({
                        message_id: messageId,
                        image_path: img
                    })
            }

            message.id = messageId;

            return message;
        } catch (e) {
            throw e;
        }
    })
}

export const getMessageColumns = (): string[] => {
    return [
        'messages.id as message_id',
        'messages.sender_id as message_sender_id',
        'messages.chat_id as message_chat_id',
        'messages.content as message_content',
        'messages.created_at as message_created_at',
        'messages.deleted_at as message_deleted_at'
    ]
}
