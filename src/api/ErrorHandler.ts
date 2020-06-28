import { Response } from "express";
import { Responses } from "./Responses";
import { ErrorInterface } from "../config/resources/ErrorInterface";
import {info, debug, error} from "../modules/logger";

export class ErrorHandler{
    private res :Response;
    private err :ErrorInterface;
    public responses :Responses;

    constructor(res :Response, err :any){
        this.res = res;
        this.err = err;
        this.responses = new Responses(this.res);
    }

    handleError(){
        switch(this.err.status){
            case 404:
                this.responses.notFound(this.err.details);
                break;
            case 400:
                this.responses.badRequest(this.err.details);
                break;
            case 500:
                error(JSON.stringify(this.err));
                this.responses.serverError(this.err.details);
                break;
            default:
                error(JSON.stringify(this.err));
                this.responses.serverError(this.err.details);
                break;
        }
    }
}