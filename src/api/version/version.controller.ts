import {Controller} from "../Controller";
import {VersionService} from "./version.service";
import { Apollo } from '../../config/App';

export class VersionController extends Controller{
    private service :VersionService;

    constructor(Apollo :Apollo){
        super(Apollo);
        this.service = new VersionService();
    }

    public getVersion() :void{
        this.responses.responseObject(200, {version: this.service.getVersion()})
    }
}