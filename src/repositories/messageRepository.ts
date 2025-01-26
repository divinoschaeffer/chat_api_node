import {Message} from "../models/Message";
import database from "../database";
import {messagesFromDbList} from "./factories/messageFactory";

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

export const count = async (chatId: number): Promise<number> => {
   const [result] = await database('messages')
       .where('chat_id', chatId)
       .where('deleted_at', null)
       .count({ count: '*' });

   if (result.count === undefined)
   {
       return 0;
   }

   return result.count as number;
}

export const list = async (chatId: number, limit: number, offset: number): Promise<Message[]> => {
    const result = await database<Message>('messages')
        .select([
            ...getMessageColumns(),
            'images_messages.image_path as images_messages_image_path'
        ])
        .leftJoin('images_messages', 'images_messages.message_id', '=', 'messages.id')
        .offset(offset)
        .limit(limit)
        .where('chat_id', chatId)
        .where('deleted_at', null)
        .orderBy('created_at', 'desc');

    return messagesFromDbList(result);
}

export const softDelete = async (messageId: number): Promise<void> => {
    await database<Message>('messages')
        .update('deleted_at', new Date())
        .where('id', messageId);
}

export const getMessageById = async (messageId: number): Promise<Message|null> => {
    const result = await database<Message>('messages')
        .select([
            ...getMessageColumns(),
            'images_messages.image_path as images_messages_image_path'
        ])
        .leftJoin('images_messages', 'images_messages.message_id', '=', 'messages.id')
        .where('message_id', messageId)
        .where('deleted_at', null);

    const list: Message[] = messagesFromDbList(result);
    return (list === undefined || list.length === 0) ? null : list[0];
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
