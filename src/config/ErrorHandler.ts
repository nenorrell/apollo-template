import { Response } from "express";
import {error} from "../modules/logger/logger";
import {ErrorInterface, Responses} from "@apollo-api/core";

export class ErrorHandler {
    private res :Response;
    private err :ErrorInterface;
    public responses :Responses;

    constructor(res :Response, err :any) {
        this.res = res;
        this.err = err;
        this.responses = new Responses(this.res);
    }

    handleError() {
        switch(this.err.status) {
        case 401:
            this.responses.unauthorized(this.err.details);
            break;
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
            error("Internal error", {}, this.err);
            this.responses.serverError(this.err.details);
            break;
        }
    }
}
