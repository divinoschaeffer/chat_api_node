import multer, {Multer} from "multer";
import {UnauthorizedFileError} from "./UnauthorizedFileError";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + file.originalname);
    },
});

const fileFilter = (req: any, file: any, cb: any) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new UnauthorizedFileError('Only image files authorized (JPEG, PNG, GIF, WEBP).'), false);
    }
};

export const upload: Multer = multer({
    storage,
    fileFilter,
    limits: {fileSize: 5 * 1024 * 1024},
});
