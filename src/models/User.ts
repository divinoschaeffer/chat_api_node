export class User {
    id: number|null;
    name: string;
    email: string;
    password: string;
    admin: boolean;
    created_at: Date|null;

    public constructor(
        id: number|null,
        name: string,
        email: string,
        password: string,
        admin: boolean = false,
        created_at: Date|null = null
    ) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.admin = admin;
        this.created_at = created_at
    }
}
