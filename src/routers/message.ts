import {Router} from "express";
import {createMessage} from "../features/messages/create/createMessageController";
import {upload} from "../utils/upload";
import {listingMessageController} from "../features/messages/listing/listingMessageController";
import {deleteMessageController} from "../features/messages/delete/deleteMessageController";

const messageRouter: Router = Router({mergeParams: true});

/**
 * @swagger
 * tags:
 *  - name: Message
 *    description: Message routes
 */


/**
 * @swagger
 * /api/chat/{chatId}/message:
 *   post:
 *     summary: Create a new message with optional image uploads
 *     description: Creates a new message in a specific chat and optionally uploads up to two images.
 *     tags:
 *       - Message
 *     parameters:
 *       - in: path
 *         name: chatId
 *         required: true
 *         description: The ID of the chat where the message will be created.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Up to 2 images to upload.
 *               content:
 *                 type: string
 *                 description: The content of the message.
 *                 example: "Hello, this is a message!"
 *               sender:
 *                 type: number
 *                 description: The ID of the sender.
 *                 example: 4
 *     responses:
 *       201:
 *         description: Message successfully created.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   $ref: '#/components/schemas/Message'
 *       400:
 *         description: Invalid input or file upload error.
 *       500:
 *         description: Server error.
 */
messageRouter.post('', upload.array('images', 2), createMessage);

/**
 * @swagger
 * /api/chat/{chatId}/message:
 *   get:
 *     summary: Get a paginated list of messages for a specific chat
 *     description: Retrieve messages for a chat, paginated 50 by 50, sorted from the most recent to the oldest.
 *     tags:
 *       - Message
 *     parameters:
 *       - in: path
 *         name: chatId
 *         required: true
 *         description: The ID of the chat whose messages are to be retrieved.
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         required: false
 *         description: The page number for pagination (default is 1).
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: A list of messages for the chat.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalCount:
 *                   type: integer
 *                   description: The total number of messages available.
 *                   example: 10
 *                 messages:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Message'
 *       404:
 *         description: Chat not found or no messages available.
 *       500:
 *         description: Server error.
 */
messageRouter.get('', listingMessageController);

/**
 * @swagger
 * /api/chat/{chatId}/message/{messageId}:
 *   delete:
 *     summary: Delete a specific message by ID
 *     description: Deletes a message with the specified message ID.
 *     tags:
 *       - Message
 *     parameters:
 *       - in: path
 *         name: messageId
 *         required: true
 *         description: The ID of the message to delete.
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Message successfully deleted (no content).
 *       404:
 *         description: Message not found.
 *       500:
 *         description: Server error.
 */
messageRouter.delete('/:messageId', deleteMessageController);

export default messageRouter;
