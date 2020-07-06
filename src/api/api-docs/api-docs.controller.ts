import {Request, Response, NextFunction} from 'express';
import {Controller} from "../Controller";
import {Routes} from "../../config/Routes/routes";
import { Route } from '../../config/Routes/resources/Route';
import { Apollo } from '../../config/App';

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