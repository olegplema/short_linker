

export default class HttpError extends Error{
    public status:number
    constructor(message: string, status: number) {
        super(message)
        this.status = status
    }

    public static NotFoundError(message:string){
        return new HttpError(message, 404)
    }

    public static ForbiddenError(message:string){
        return new HttpError(message, 403)
    }

    public static BadRequestError(message:string){
        return new HttpError(message, 400)
    }

    public static ConflictError(message:string){
        return new HttpError(message, 409)
    }

    public static UnauthorizedError(message:string){
        return new HttpError(message, 409)
    }
}