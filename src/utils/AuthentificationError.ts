export class AuthentificationError extends Error {
    constructor(msg: string) {
        super(msg);
        Object.setPrototypeOf(this, AuthentificationError.prototype);
    }
}