import {Request, Response} from 'express';
import {Controller} from "../Controller";
import {VersionService} from "./Version.service";

export class VersionController extends Controller{
    private service :VersionService;

    constructor(req :Request, res :Response){
        super(req, res);
        this.service = new VersionService();
    }

    public getVersion() :void{
        this.responses.responseObject(200, {version: this.service.getVersion()})
    }
}