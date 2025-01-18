import {Chat} from "../models/Chat";
import database from "../database";
import {PublicUserDTO} from "../models/PublicUserDTO";

export const isExisting = async (users_id: number[]): Promise<boolean> => {
    if (users_id.length === 0) {
        return false;
    }

    const result = await database<Chat>('chats')
        .join('users_chats', 'users_chats.chat_id', '=', 'chats.id')
        .whereIn('users_chats.user_id', users_id)
        .groupBy('chats.id')
        .havingRaw('COUNT(DISTINCT users_chats.user_id) = ?', [users_id.length])
        .select('chats.id');

    for (const chat of result) {
        const userIdsInChat = await database('users_chats')
            .where('chat_id', chat.id)
            .select('user_id')
            .then((rows) => rows.map((row) => row.user_id));

        const isExactMatch =
            users_id.length === userIdsInChat.length &&
            users_id.every((id) => userIdsInChat.includes(id));

        if (isExactMatch) {
            return true;
        }
    }

    return false;
};

export const store = async (chat: Chat): Promise<Chat> => {
    return await database.transaction(async (trx) => {
        try {
            const [chatId]: number[] = await trx<Chat>('chats')
                .insert(
                    {
                        name: chat.name,
                        type: chat.type,
                        creator_id: chat.creator_id,
                        created_at: chat.created_at,
                    },
                    'id'
                );

            const userChats = chat.users.map((user: PublicUserDTO) => ({
                user_id: user.id,
                chat_id: chatId,
            }));

            await trx('users_chats').insert(userChats);

            chat.id = chatId;

            return chat;
        } catch (error) {
            console.error('Transaction failed:', error);
            throw error;
        }
    });
};