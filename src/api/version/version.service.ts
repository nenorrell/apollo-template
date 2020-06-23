import {Service} from "../Service";
import {execSync} from "child_process";

export class VersionService extends Service{
    public getVersion() :string{
        return this.getGitHash()
        .toString()
        .trim();
    }

    public getGitHash() :Buffer{
        return execSync('git rev-parse --short HEAD')
    }
}