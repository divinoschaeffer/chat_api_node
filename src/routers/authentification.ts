import {Router} from "express";
import {register} from "../features/authentification/register/registerController";

const authRouter:Router = Router()

authRouter.post('/register', register);

export default authRouter;
