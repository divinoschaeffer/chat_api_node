export class UnauthorizedActionError extends Error {
    constructor(msg: string) {
        super(msg);
        Object.setPrototypeOf(this, UnauthorizedActionError.prototype);
    }
}