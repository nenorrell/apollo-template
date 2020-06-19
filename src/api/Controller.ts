import {Request, Response} from 'express';
import { Responses } from './Responses';

export class Controller{
    private res :Response;
    private req :Request;
    public responses :Responses;

    constructor(req :Request, res :Response){
        this.req = req;
        this.res = res;
        this.responses = new Responses(res);
    }
}