import {Chat} from "../../models/Chat";
import {createPublicDtoFromUser, PublicUserDTO} from "../../models/PublicUserDTO";
import {User} from "../../models/User";
import {userFromDB} from "./userFactory";

export const chatFromDB = (results: any[]): Chat|null => {
    if (results.length === 0 ) return null;

    return new Chat(
        results[0].chat_id,
        results[0].chat_type,
        results[0].chat_name,
        results[0].creator_id,
        allPublicUserDTOFromDB(results),
        results[0].created_at
    )
}

const allPublicUserDTOFromDB = (results: any[]): PublicUserDTO[] => {
    let users: User[] = [];

    for (const result of results) {
        users.push(userFromDB(result)!)
    }

    return users.map((user: User) => createPublicDtoFromUser(user))
}
