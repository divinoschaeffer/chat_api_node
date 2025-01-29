import {Chat} from "../../models/Chat";
import {createPublicDtoFromUser, PublicUserDTO} from "../../models/PublicUserDTO";
import {User} from "../../models/User";
import {userFromDB} from "./userFactory";

export const chatFromDBList = (results: any[]): Chat[] => {
    if (results.length === 0) {
        return [];
    }

    const chatsMap: { [key: number]: Chat } = {};

    for (const result of results) {
        const chatId = result.chat_id;

        if (!chatsMap[chatId]) {
            chatsMap[chatId] = new Chat(
                chatId,
                result.chat_type,
                result.chat_name,
                result.creator_id,
                [],
                result.created_at
            );
        }

        const user = userFromDB(result);
        if (user) {
            const publicUserDTO = createPublicDtoFromUser(user);
            if (!chatsMap[chatId].users.some(u => u.id === publicUserDTO.id)) {
                chatsMap[chatId].users.push(publicUserDTO);
            }
        }
    }

    return Object.values(chatsMap);
};

export const chatFromDB = (results: any[]): Chat | null => {
    if (results.length === 0) {
        return null;
    }

    const { chat_id, chat_type, chat_name, creator_id, created_at } = results[0];

    return new Chat(
        chat_id,
        chat_type,
        chat_name,
        creator_id,
        extractPublicUsers(results),
        created_at
    );
};

const extractPublicUsers = (results: any[]): PublicUserDTO[] => {
    return results
        .map(userFromDB)
        .filter((user): user is User => user !== null)
        .map(createPublicDtoFromUser);
};
