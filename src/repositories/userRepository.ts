import database from "../database";
import {User} from "../models/User";
import {Chat} from "../models/Chat";
import {getChatColumns} from "./chatRepository";
import {chatFromDBList} from "./factories/chatFactory";

export const isExisting = async (userName: string, userEmail: string): Promise<boolean> => {
    const result: User[] = await database<User>('users')
        .where('name', userName)
        .orWhere('email', userEmail);

    return result.length !== 0;
}

export const getUserByEmail = async (email: string): Promise<User|undefined> => {
    return database<User>('users')
        .where('email', email)
        .first();
}

export const getUserByName = async (userName: string): Promise<User|undefined> => {
    return database<User>('users')
        .where('name', userName)
        .first();
}

export const getUserById = async (id: number): Promise<User|undefined> => {
    return database<User>('users')
        .where('id', id)
        .first();
}

export const store = async (user: User): Promise<User> => {
    const result: number[] = await database<User>('users')
        .insert({
            name: user.name,
            email: user.email,
            password: user.password,
            admin: user.admin,
            created_at: user.created_at
        }, 'id')

    const id: number = result[0];

    const userResult: User|undefined = await database<User>('users')
        .where('id', id)
        .first()

    if (userResult == null) {
        throw new Error("Error storing user");
    }

    return userResult;
}

export const getAllChat =  async (userId: number): Promise<Chat[]> => {
    const result = await database('chats')
        .select(getChatColumns())
        .leftJoin('users_chats', 'users_chats.chat_id', '=', 'chats.id')
        .leftJoin('users', 'users.id', '=', 'users_chats.user_id')
        .whereIn('chat_id',
            database.select('chat_id').from('users_chats').where('user_id', userId)
        )
        .where('deleted_at', null);

    return chatFromDBList(result)
}

export const getUserColumns = (): string[] => {
    return [
        'users.id as user_id',
        'users.name as user_name',
        'users.email as user_email',
        'users.password as user_password',
        'users.admin as user_admin',
        'users.created_at as user_created_at'
    ]
}