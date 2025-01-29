import {Chat} from "../models/Chat";
import database from "../database";
import {PublicUserDTO} from "../models/PublicUserDTO";
import {getUserColumns} from "./userRepository";
import {chatFromDB} from "./factories/chatFactory";

export const isExisting = async (users_id: number[]): Promise<boolean> => {
    if (users_id.length === 0) {
        return false;
    }

    const result = await database<Chat>('chats')
        .join('users_chats', 'users_chats.chat_id', '=', 'chats.id')
        .whereIn('users_chats.user_id', users_id)
        .where('deleted_at', null)
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
            throw error;
        }
    });
};

export const update = async (chat: Chat): Promise<void> => {
    await database('chats')
        .update('name', chat.name)
        .where('id', chat.id!)
        .where('deleted_at', null);
}

export const getChatById = async (chatId: number): Promise<Chat|null> => {
    const result = await database('chats')
        .select(getChatColumns())
        .leftJoin('users_chats', 'users_chats.chat_id', '=', 'chats.id')
        .leftJoin('users', 'users.id', '=', 'users_chats.user_id')
        .where('chats.id', chatId)
        .where('deleted_at', null);

    return chatFromDB(result);
}

export const softDelete = async (chatId: number): Promise<void> => {
    await database.transaction(async (trx) => {
        try {
            await trx('chats')
                .update('deleted_at', new Date())
                .where('id', chatId);

            await trx('users_chats')
                .update('deleted', true)
                .where('chat_id', chatId);
        } catch (e: any) {
            throw e;
        }
    })
}

export const getChatColumns = (): string[] => {
    return [
        ...getUserColumns(),
        'chats.id as chat_id',
        'chats.name as chat_name',
        'chats.type as chat_type',
        'chats.creator_id as creator_id',
        'chats.created_at as created_at',
    ];
}
