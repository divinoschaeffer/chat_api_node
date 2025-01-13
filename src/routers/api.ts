import authRouter from "./authentification";
import {Router} from "express";

const apiRouter = Router();

apiRouter.use('/auth', authRouter);

export default apiRouter;
