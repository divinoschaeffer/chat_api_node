import {Router} from "express";
import {register} from "../features/authentification/register/registerController";
import {login} from "../features/authentification/login/loginController";

const authRouter:Router = Router()

authRouter.post('/register', register);
authRouter.post('/login', login);

export default authRouter;
