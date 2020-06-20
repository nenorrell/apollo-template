import {Request, Response} from 'express';
import {Controller} from "../Controller";
import { Route } from '../../config/Routes/resources/Route';
import { ExampleService } from './example.service';


export class ComplexExample extends Controller{
    private service :ExampleService;

    constructor(req :Request, res :Response, route :Route){
        super(req, res, route);
        this.service = new ExampleService();
    }

    public displayRoutes() :void{
        this.responses.responseObject(200, this.service.getExample());
    }
}