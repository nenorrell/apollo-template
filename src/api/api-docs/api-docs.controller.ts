import {Request, Response, NextFunction} from 'express';
import {Controller} from "../Controller";
import {Routes} from "../../config/Routes/routes";
import { Route } from '../../config/Routes/resources/Route';

export class VersionController extends Controller{
    private service :Routes;

    constructor(req :Request, res :Response, next :NextFunction, route :Route){
        super(req, res, next, route);
        this.service = new Routes();
    }

    public displayRoutes() :void{
        this.responses.responseArray(200, this.service.getFormattedRoutes());
    }
}