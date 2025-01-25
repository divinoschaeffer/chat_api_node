import {NextFunction, Request, Response} from "express";
import {UnauthorizedFileError} from "../utils/UnauthorizedFileError";
import {RessourceNotFoundError} from "../utils/RessourceNotFoundError";

export const handleErrorMiddleware = (error: Error, req: Request, res: Response, next: NextFunction): any => {
    if (error.message) {
        if (error instanceof UnauthorizedFileError) {
            return res.status(400).json({ error: error.message });
        } else if (error instanceof RessourceNotFoundError) {
            res.status(404).json({ message: "Ressource not found", error: error.message });
        }
    }
}
