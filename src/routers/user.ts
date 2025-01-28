import {Router} from "express";
import {getUserController} from "../features/user/get/getUserController";

const userRouter: Router = Router();

userRouter.get('/:user_name', getUserController);

export default userRouter;
