import {Controller} from "../Controller";
import {VersionService} from "./version.service";

export class VersionController extends Controller{
    private service :VersionService;

    constructor(){
        super();
        this.service = new VersionService();
    }

    public getVersion() :void{
        return this.responses.responseObject(200, {
            version: this.service.getVersion()
        });
    }
}