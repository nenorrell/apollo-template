import { Apollo } from '../../config/App';
import {Controller} from "../Controller";

export class VersionController extends Controller{
    constructor(Apollo :Apollo){
        super(Apollo);
    }

    public index() :void{
        this.responses.responseObject(200, "Healthy")
    }
}