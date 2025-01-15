import {User} from "./User";

export class UserDTO {
    id: number;
    name: string;
    email: string;
    admin: boolean;
    created_at: Date|null;

    public constructor(
        id: number,
        name: string,
        email: string,
        admin: boolean = false,
        created_at: Date|null = null
    ) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.admin = admin;
        this.created_at = created_at
    }
}

export const createDtoFromUser = (user: User): UserDTO => {
    return new UserDTO(
        user.id!,
        user.name,
        user.email,
        user.admin,
        user.created_at
    )
}