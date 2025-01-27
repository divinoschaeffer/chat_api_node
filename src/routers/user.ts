import {Router} from "express";
import {searchUserController} from "../features/user/search/searchUserController";

const userRouter: Router = Router();

userRouter.get('/search/:userName', searchUserController);

export default userRouter;
