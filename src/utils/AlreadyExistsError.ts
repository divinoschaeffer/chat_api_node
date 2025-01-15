export class AlreadyExistsError extends Error {
    constructor(msg: string) {
        super(msg);
        Object.setPrototypeOf(this, AlreadyExistsError.prototype);
    }
}
