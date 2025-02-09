import chat from "../routers/chat";

/**
 * @swagger
 * components:
 *  schemas:
 *      Message:
 *          type: object
 *          properties:
 *              id:
 *                  type: integer
 *                  example: 2
 *              sender_id:
 *                  type: integer
 *                  example: 1
 *              chat_id:
 *                  type: integer
 *                  example: 4
 *              content:
 *                  type: string
 *                  example: blabla
 *              images:
 *                  type: array
 *                  items:
 *                      type: string
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
export class Message{
    id: number|null;
    sender_id: number;
    chat_id: number;
    content: string;
    images: string[];
    created_at: Date|null;
    deleted_at: Date|null;

    public constructor(
        id: number|null,
        sender_id: number,
        chat_id: number,
        content: string,
        images: string[],
        created_at: Date|null,
        deleted_at: Date|null
    ) {
        this.id = id;
        this.sender_id = sender_id;
        this.chat_id = chat_id;
        this.content = content;
        this.images = images;
        this.created_at = created_at;
        this.deleted_at = deleted_at;
    }
}