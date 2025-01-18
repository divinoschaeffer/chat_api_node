import {ChatType} from "./ChatType";
import {PublicUserDTO} from "./PublicUserDTO";

export class Chat {
    id: number|null;
    type: ChatType;
    name: string;
    creator_id: number;
    users: PublicUserDTO[];
    created_at: Date|null;

    public constructor(
        id: number|null,
        type: ChatType,
        name: string,
        creator: number,
        users: PublicUserDTO[],
        created_at: Date|null = null
    ) {
        this.id = id;
        this.type = type;
        this.name = name;
        this.creator_id = creator;
        this.users = users;
        this.created_at = created_at;
    }
}