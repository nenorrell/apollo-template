import {Request, Response, NextFunction} from 'express';
import {Controller} from "../Controller";
import { Route } from '../../config/Routes/resources/Route';
import { Apollo } from '../../config/App';

export class VersionController extends Controller{
    constructor(Apollo :Apollo){
        super(Apollo);
    }

    public index() :void{
        this.responses.responseObject(200, "Healthy")
    }
}