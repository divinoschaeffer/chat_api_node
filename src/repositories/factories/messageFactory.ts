import {Message} from "../../models/Message";

export const messagesFromDbList = (results: any[]): Message[] => {
    if (results.length === 0) return [];

    const messagesMap: { [key: number]: Message } = {};

    for (const result of results) {
        const messageId = result.message_id;

        if (!messagesMap[messageId]) {
            messagesMap[messageId] = new Message(
                messageId,
                result.message_sender_id,
                result.message_chat_id,
                result.message_content,
                [],
                result.message_created_at,
                result.message_deleted_at
            );
        }

        if (result.images_messages_image_path) {
            messagesMap[messageId].images.push(result.images_messages_image_path);
        }
    }

    return Object.values(messagesMap).sort(
        (a: Message, b: Message): number => (b.created_at?.getTime() || 0) - (a.created_at?.getTime() || 0)
    );
};
