import {Request, Response} from 'express';
import {Controller} from "../Controller";
import {Routes} from "../../config/Routes/routes";

export class VersionController extends Controller{
    private service :Routes;

    constructor(req :Request, res :Response){
        super(req, res);
        this.service = new Routes();
    }

    public displayRoutes() :void{
        this.responses.responseArray(200, this.service.buildRoutesArray());
    }
}