import {Router} from "express";
import {getUserController} from "../features/user/get/getUserController";
import {getUserChatsController} from "../features/user/chat/getUserChatsController";

const userRouter: Router = Router();

/**
 * @swagger
 * /api/user/{user_name}:
 *   get:
 *     summary: Retrieve user details by username
 *     description: Fetches details of a user based on the provided username.
 *     tags:
 *       - User
 *     parameters:
 *       - in: path
 *         name: user_name
 *         required: true
 *         description: The username of the user to retrieve.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User details successfully retrieved.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                  user:
 *                      $ref: '#/components/schemas/PublicUserDTO'
 *       404:
 *         description: User not found.
 *       500:
 *         description: Server error.
 */
userRouter.get('/:user_name', getUserController);

userRouter.get('/:user_id/chat', getUserChatsController);

export default userRouter;
