import {Chat} from "../../../models/Chat";
import {isExisting, store} from "../../../repositories/chatRepository";
import {AlreadyExistsError} from "../../../utils/AlreadyExistsError";
import {User} from "../../../models/User";
import {getUserById} from "../../../repositories/userRepository";
import {RessourceNotFoundError} from "../../../utils/RessourceNotFoundError";
import {createDtoFromUser} from "../../../models/UserDTO";
import {ChatType} from "../../../models/ChatType";
import {UnauthorizedActionError} from "../../../utils/UnauthorizedActionError";

export const handleCreateChat = async (values: any): Promise<Chat> => {
    const exist: boolean = await isExisting(values.users);
    if (exist) {
        throw new AlreadyExistsError("Chat already exist");
    }

    const users: User[] = await Promise.all(
        values.users.map(async (id: number) => {
            const user = await getUserById(id);
            if (!user) {
                throw new RessourceNotFoundError(`User with ID ${id} not found`);
            }
            return user;
        })
    );

    let valid = true;
    users.map((user) => {
        if (user.id == values.authUser) {
            valid = true;
        }
    });

    if (!valid) {
        throw new UnauthorizedActionError("Cannot create Chat without authenticated user");
    }

    let name: string = values.name;
    if (name == undefined) {
        name = users.map((user) => user.name).join(', ');
    }

    const type: ChatType = (users.length > 2) ? ChatType.GROUP : ChatType.PRIVATE;

    let chat: Chat = new Chat(
        null,
        type,
        name,
        values.creator,
        users.map((user) => createDtoFromUser(user)),
        new Date()
    )

    return await store(chat);
}