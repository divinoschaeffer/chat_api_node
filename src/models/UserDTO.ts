import {User} from "./User";

/**
 * @swagger
 * components:
 *   schemas:
 *     UserDTO:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: John Doe
 *         email:
 *           type: string
 *           format: email
 *           example: johndoe@example.com
 *         admin:
 *           type: boolean
 *           example: false
 *         created_at:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           example: 2025-01-15T08:45:23Z
 */
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