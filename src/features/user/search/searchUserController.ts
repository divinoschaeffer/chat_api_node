import {Response, Request} from "express";
import {handleSearchUser} from "./searchUserService";
import {PublicUserDTO} from "../../../models/PublicUserDTO";

export const searchUserController = async (req: Request, res: Response): Promise<void> => {
    const userName: string = req.params.userName;

    if (userName === undefined) {
        res.status(400).json({message: "Params userName undefined"});
    }

    try {
        const user: PublicUserDTO|null = await handleSearchUser(userName);
        res.status(200).json(user);
    } catch (error: any) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}