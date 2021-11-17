import { Controller } from "@apollo-api/core";
import { ApolloType } from "../../config/Apollo/ApolloConfig";
import {VersionService} from "./version.service";

export class VersionController extends Controller {
    private service :VersionService;

    constructor(Apollo :ApolloType) {
        super(Apollo);
        this.service = new VersionService(Apollo);
    }

    public getVersion() :void {
        return this.responses.responseObject(200, {
            version: this.service.getVersion()
        });
    }
}
