import authRouter from "./authentification";
import {Router} from "express";
import chatRouter from "./chat";
import userRouter from "./user";

const apiRouter = Router();

apiRouter.use('/auth', authRouter);
apiRouter.use('/chat', chatRouter);
apiRouter.use('/user', userRouter);

export default apiRouter;
