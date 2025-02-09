import authRouter from "./authentication";
import {Router} from "express";
import chatRouter from "./chat";
import {authenticateToken} from "../middleware/authenticationMiddleware";

const apiRouter = Router();

apiRouter.use('/auth', authRouter);

// @ts-ignore
apiRouter.use('/chat', authenticateToken, chatRouter);

export default apiRouter;
