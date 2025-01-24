import {Router} from "express";
import {createMessage} from "../features/messages/create/createMessageController";
import {upload} from "../utils/upload";

const messageRouter: Router = Router({mergeParams: true});

messageRouter.post('', upload.array('images', 2), createMessage);

export default messageRouter;
