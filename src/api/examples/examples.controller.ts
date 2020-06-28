import {Request, Response, NextFunction} from 'express';
import {Controller} from "../Controller";
import { Route } from '../../config/Routes/resources/Route';
import { ExampleService } from './example.service';

export class ComplexExample extends Controller{
    private service :ExampleService;

    constructor(req :Request, res :Response, next :NextFunction, route :Route){
        super(req, res, next, route);
        this.service = new ExampleService();
    }

    public index() :void{
        try{
            this.responses.responseObject(200, this.service.getExample());
        }
        catch(e){
            this.next(e);
        }
    }
}