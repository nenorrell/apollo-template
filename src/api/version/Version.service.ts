import {Service} from "../Service";
import {execSync} from "child_process"

export class VersionService extends Service{
    public getVersion() :string{
        return execSync('git rev-parse --short HEAD')
        .toString()
        .trim();
    }
}