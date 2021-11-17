import { Service } from "@apollo-api/core";
import { ApolloType } from "../../config/Apollo/ApolloConfig";
import * as versionFile from "./BUILD-VERSION.json";
export class VersionService extends Service {
    constructor(Apollo :ApolloType) {
        super(Apollo);
    }

    public getVersion() :string {
        return versionFile.version;
    }
}
