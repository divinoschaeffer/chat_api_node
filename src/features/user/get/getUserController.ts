import {Response, Request} from "express";
import {handleSearchUser} from "./getUserService";
import {PublicUserDTO} from "../../../models/PublicUserDTO";

export const getUserController = async (req: Request, res: Response): Promise<void> => {
    const userName: string = req.params.user_name;

    if (userName === '') {
        res.status(400).json({message: "Params user_name undefined"});
    }

    try {
        const user: PublicUserDTO|null = await handleSearchUser(userName);
        res.status(200).json(user);
    } catch (error: any) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}