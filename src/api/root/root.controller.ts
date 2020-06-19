import {Request, Response} from 'express';
import {Controller} from "../Controller";

export class VersionController extends Controller{
    constructor(req :Request, res :Response){
        super(req, res);
    }

    public index() :void{
        this.responses.responseObject(200, "Healthy")
    }
}