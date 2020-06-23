import {Request, Response} from 'express';
import {Controller} from "../Controller";
import {VersionService} from "./version.service";
import { Route } from '../../config/Routes/resources/Route';

export class VersionController extends Controller{
    private service :VersionService;

    constructor(req :Request, res :Response, route :Route){
        super(req, res, route);
        this.service = new VersionService();
    }

    public getVersion() :void{
        this.responses.responseObject(200, {version: this.service.getVersion()})
    }
}