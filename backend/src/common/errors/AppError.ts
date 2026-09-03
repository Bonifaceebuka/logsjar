export class AppError extends Error {
    public statusCode: number;
    public data: number;

    constructor(message: string, statusCode?: number, data?: any) {
        super(message);
        this.statusCode = statusCode ? statusCode : 400;
        this.data = data ? data : null;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}