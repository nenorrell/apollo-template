import {Request, Response} from 'express';
import {Controller} from "../Controller";
import { Route } from '../../config/Routes/resources/Route';

export class VersionController extends Controller{
    constructor(req :Request, res :Response, route :Route){
        super(req, res, route);
    }

    public index() :void{
        this.responses.responseObject(200, "Healthy")
    }
}