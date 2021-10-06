import { Controller, Routes } from "@apollo-api/core";

export class ApiDocsController extends Controller{
    private service :Routes;

    constructor(){
        super();
        this.service = new Routes(this.config);
    }

    public async displayRoutes() :Promise<void>{
        this.responses.responseArray(200, await this.service.getFormattedRoutes());
    }
}