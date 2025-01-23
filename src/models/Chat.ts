import {ChatType} from "./ChatType";
import {PublicUserDTO} from "./PublicUserDTO";

/**
 * @swagger
 * components:
 *  schemas:
 *      Chat:
 *          type: object
 *          properties:
 *              id:
 *                  type: integer
 *                  example: 1
 *              name:
 *                  type: string
 *                  example: Famille
 *              creator_id:
 *                  type: integer
 *                  example: 3
 *              users:
 *                  type: array
 *                  items:
 *                     type:
 *                     $ref: '#/components/schemas/PublicUserDTO'
 *              created_at:
 *                  type: string
 *                  format: date-time
 *                  nullable: true
 *                  example: 2025-01-15T08:45:23Z
 *              deleted_at:
 *                  type: string
 *                  format: date-time
 *                  nullable: true
 *                  example: 2025-01-15T08:45:23Z
 */
export class Chat {
    id: number|null;
    type: ChatType;
    name: string;
    creator_id: number;
    users: PublicUserDTO[];
    created_at: Date|null;
    deleted_at: Date|null;

    public constructor(
        id: number|null,
        type: ChatType,
        name: string,
        creator: number,
        users: PublicUserDTO[],
        created_at: Date|null = null,
        deleted_at: Date|null = null
    ) {
        this.id = id;
        this.type = type;
        this.name = name;
        this.creator_id = creator;
        this.users = users;
        this.created_at = created_at;
        this.deleted_at = deleted_at;
    }
}