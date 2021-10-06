import { Service } from "@apollo-api/core";
import * as versionFile from "./BUILD-VERSION.json";
export class VersionService extends Service{
    public getVersion() :string{
        return versionFile.version;
    }
}