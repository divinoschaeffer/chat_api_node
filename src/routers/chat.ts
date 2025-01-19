import {Router} from "express";
import {createChat} from "../features/chat/create/createChatController";

const chatRouter: Router = Router();

/**
 * @swagger
 * tags:
 *  - name: Chat
 *    description: Chat routes
 */

/**
 * @swagger
 * /api/chat:
 *   post:
 *     summary: Create a new chat
 *     description: Creates a new chat with a specified name, creator, and list of users.
 *     tags:
 *       - Chat
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Team Project"
 *               creator:
 *                 type: number
 *                 example: 1
 *               users:
 *                 type: array
 *                 items:
 *                   type: number
 *                 minItems: 2
 *                 maxItems: 10
 *                 example: [2, 3, 4]
 *     responses:
 *       201:
 *         description: Chat successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 chat:
 *                      $ref : '#/components/schemas/Chat'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Validation error: users must contain between 2 and 10 members."
 *       403:
 *         description: Chat already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Chat already exists with the specified users."
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "An unexpected error occurred."
 */
chatRouter.post('', createChat);

export default chatRouter;
