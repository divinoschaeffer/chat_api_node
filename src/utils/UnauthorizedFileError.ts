export class UnauthorizedFileError extends Error {
    constructor(msg: string) {
        super(msg);
        Object.setPrototypeOf(this, UnauthorizedFileError.prototype);
    }
}