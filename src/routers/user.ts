import {Router} from "express";
import {getUserController} from "../features/user/get/getUserController";

const userRouter: Router = Router();

userRouter.get('/:userName', getUserController);

export default userRouter;
