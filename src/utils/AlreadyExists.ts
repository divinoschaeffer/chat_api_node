class AlreadyExists extends Error {
    constructor(msg: string) {
        super(msg);
        Object.setPrototypeOf(this, AlreadyExists.prototype);
    }
}