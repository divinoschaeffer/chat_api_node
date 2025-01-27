import {createPublicDtoFromUser, PublicUserDTO} from "../../../models/PublicUserDTO";
import {User} from "../../../models/User";
import {getUserByName} from "../../../repositories/userRepository";

export const handleSearchUser = async (userName: string): Promise<PublicUserDTO|null> => {
    const user: User|undefined = await getUserByName(userName);

    return (user === undefined) ? null : createPublicDtoFromUser(user);
}