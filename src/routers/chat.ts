import {Router} from "express";
import {createChat} from "../features/chat/create/createChatController";
import {getChat} from "../features/chat/get/getChatController";
import {updateChat} from "../features/chat/update/updateChatController";
import {deleteChat} from "../features/chat/softDelete/deleteChatController";
import messageRouter from "./message";

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

/**
 * @swagger
 * /api/chat/{chatId}:
 *   get:
 *     summary: Retrieve a specific chat by ID
 *     description: Fetches the chat data for the given chat ID.
 *     tags:
 *      - Chat
 *     parameters:
 *       - in: path
 *         name: chatId
 *         required: true
 *         description: The ID of the chat to retrieve.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Chat successfully retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 chat:
 *                      $ref: '#/components/schemas/Chat'
 *       404:
 *         description: Chat not found
 *       500:
 *         description: Server error
 */
chatRouter.get('/:chatId', getChat);

/**
 * @swagger
 * /api/chat/{chatId}:
 *   patch:
 *     summary: Update a specific chat by ID
 *     description: Updates the chat data for the given chat ID with the provided name.
 *     tags:
 *      - Chat
 *     parameters:
 *       - in: path
 *         name: chatId
 *         required: true
 *         description: The ID of the chat to update.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The new name for the chat.
 *                 example: "New Chat Name"
 *     responses:
 *       200:
 *         description: Chat successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 chat:
 *                      $ref: '#/components/schemas/Chat'
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Chat not found
 *       500:
 *         description: Server error
 */
chatRouter.patch('/:chatId', updateChat);

/**
 * @swagger
 * /api/chat/{chatId}:
 *   delete:
 *     summary: Delete a specific chat by ID
 *     description: Deletes the chat with the specified chat ID.
 *     tags:
 *      - Chat
 *     parameters:
 *       - in: path
 *         name: chatId
 *         required: true
 *         description: The ID of the chat to delete.
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Chat successfully deleted (no content).
 *       404:
 *         description: Chat not found.
 *       500:
 *         description: Server error.
 */
chatRouter.delete('/:chatId', deleteChat);

chatRouter.use('/:chatId/message', messageRouter);

export default chatRouter;
