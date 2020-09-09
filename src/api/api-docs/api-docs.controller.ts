import {Controller} from "../Controller";
import {Routes} from "../../config/Routes/routes";

export class ApiDocsController extends Controller{
    private service :Routes;

    constructor(){
        super();
        this.service = new Routes();
    }

    public displayRoutes() :void{
        this.responses.responseArray(200, this.service.getFormattedRoutes());
    }
}