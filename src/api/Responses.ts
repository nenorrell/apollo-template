import {Response} from 'express';

export class Responses{
    private res :Response;
    constructor(res :Response){
        this.res = res;
    }

    public responseObject(code :number, data :any) :void{
        this.res.status(code).json({
            response: data,
            code: code
        });
    }

    public responseArray(code :number, data :Array<any>) :void{
        this.res.status(code).json({
            response: data,
            code: code
        });
    }

    public badRequest(data :any, options ?:any){
        this.res.status(400).json({
            code: 400,
            error: "Bad Request",
            error_description: data || ""
        });
    }

    public serverError(data :any, options ?:any){
        this.res.status(500).json({
            code: 500,
            error: "Internal Server Error",
            error_description: data || ""
        });
    }

    public notFound(data :any, options ?:any){
        this.res.status(404).json({
            response: {},
            error: "Not Found",
            error_description: data || "",
            code: 404
        });
    }

    public unauthorized(data :any, options ?:any){
        this.res.status(401).json({
            response: {},
            error: "Unauthorized",
            error_description: data || "",
            code: 401
        });
    }
}