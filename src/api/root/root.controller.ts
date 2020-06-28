import {Request, Response, NextFunction} from 'express';
import {Controller} from "../Controller";
import { Route } from '../../config/Routes/resources/Route';

export class VersionController extends Controller{
    constructor(req :Request, res :Response, next :NextFunction, route :Route){
        super(req, res, next, route);
    }

    public index() :void{
        this.responses.responseObject(200, "Healthy")
    }
}