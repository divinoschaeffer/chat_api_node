import {Router} from "express";
import {createChat} from "../features/chat/create/createChatController";

const chatRouter: Router = Router();

chatRouter.post('', createChat);

export default chatRouter;
