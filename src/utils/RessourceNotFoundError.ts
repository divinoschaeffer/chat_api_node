export class RessourceNotFoundError extends Error {
    constructor(msg: string) {
        super(msg);
        Object.setPrototypeOf(this, RessourceNotFoundError.prototype);
    }
}
