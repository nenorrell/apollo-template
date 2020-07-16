import { Apollo } from '../../config/App';
import {Controller} from "../Controller";
import {Routes} from "../../config/Routes/routes";

export class VersionController extends Controller{
    private service :Routes;

    constructor(Apollo :Apollo){
        super(Apollo);
        this.service = new Routes();
    }

    public displayRoutes() :void{
        this.responses.responseArray(200, this.service.getFormattedRoutes());
    }
}