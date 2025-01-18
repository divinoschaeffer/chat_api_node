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
 */
export class PublicUserDTO {
    id: number;
    name: string;

    public constructor(
        id: number,
        name: string,
    ) {
        this.id = id;
        this.name = name;
    }
}

export const createPublicDtoFromUser = (user: User): PublicUserDTO => {
    return new PublicUserDTO(
        user.id!,
        user.name,
    )
}