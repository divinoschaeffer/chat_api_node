import authRouter from "./authentification";
import {Router} from "express";
import chatRouter from "./chat";

const apiRouter = Router();

apiRouter.use('/auth', authRouter);
apiRouter.use('/chat', chatRouter);

export default apiRouter;
