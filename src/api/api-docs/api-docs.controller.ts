import { Controller, Routes } from "@apollo-api/core";
import { ApolloType } from "../../config/Apollo/ApolloConfig";

export class ApiDocsController extends Controller {
    private service :Routes;

    constructor(Apollo :ApolloType) {
        super(Apollo);
        this.service = new Routes(this.config);
    }

    public async displayRoutes() :Promise<void> {
        this.responses.responseArray(200, await this.service.getFormattedRoutes());
    }
}
