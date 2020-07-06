import {Request, Response, NextFunction} from 'express';
import {Controller} from "../Controller";
import { Route } from '../../config/Routes/resources/Route';
import { ExampleService } from './example.service';
import { Apollo } from '../../config/App';

export class ComplexExample extends Controller{
    private service :ExampleService;

    constructor(Apollo :Apollo){
        super(Apollo);
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