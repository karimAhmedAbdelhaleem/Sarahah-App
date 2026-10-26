


export class HttpAppError extends Error {
    constructor(message = "Internal server error" , statusCode = 500 , code = "INTERNAL_SERVER_ERROR" , details = null){
        super(message);
        this.statusCode = statusCode;
        this.code = code;
        this.details = details;
    }
}