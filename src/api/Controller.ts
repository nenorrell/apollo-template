import {Request, Response} from 'express';
import { Responses } from './Responses';
import { Route } from '../config/Routes/resources/Route';
import { RouteParamType, ParamDataTypes} from '../config/Routes/resources/RouteParamType';

export class Controller{
    private res :Response;
    private req :Request;
    public responses :Responses;
    public route :Route;

    constructor(req :Request, res :Response, route :Route){
        this.req = req;
        this.res = res;
        this.responses = new Responses(this.res);
        this.route = route;
        this.validateQueryParams();
    }

    private validateQueryParams(){
        if(this.route.queryParams){
            this.route.queryParams.forEach((param :RouteParamType)=>{
                let queryParam = this.req.query[param.name];
                this.validateRequiredParam(param, queryParam);
                this.validateParamType(param, queryParam);
            });
        }
    }

    private validateRequiredParam(param :RouteParamType, queryParam :any) :void{
        if(param.required && !queryParam){
            this.responses.badRequest(`${param.name} was not sent and is required`)
        }
    }

    private validateParamType(param :RouteParamType, queryParam :any) :void{
        if(queryParam){
            if(!this.isValidTypes(param.type, queryParam)){
                this.responses.badRequest(
                    `Invalid param type for ${param.name}: Expected ${param.typeDisplayValue} but got ${typeof queryParam}`
                );
            }
        }
    }

    private isValidTypes(type :ParamDataTypes, paramValue :any) :Boolean{
        let isValid :Boolean = true;
        switch(type){
            case ParamDataTypes.boolean:
                let value = typeof paramValue == "string" ? this.parseBool(paramValue) : paramValue;
                if(typeof value !== "boolean"){
                    isValid = false;
                }
                break;
            
            case ParamDataTypes.number:
                if(!this.isNum(paramValue) || isNaN(parseInt(paramValue))){
                    isValid = false;
                }
                break;
            
            case ParamDataTypes.object:
                if(!(typeof paramValue === "object")){
                    isValid = false;
                }
                break;
            
            case ParamDataTypes.string:
                if(typeof paramValue != "string"){
                    isValid = false;
                }
                break;

            case ParamDataTypes.array:
                if(!Array.isArray(paramValue)){
                    isValid = false;
                }
                break;

            default:
                isValid = false;
        }

        return isValid;
    }

    private parseBool(stringIn :string) :Boolean{
        try{
            if(stringIn === "false"){
                return false;
            }
            if(stringIn === "true"){
                return true;
            }
            throw Error("Invalid value supplied");
        }
        catch(e){
            throw e;
        }
    }

    private isNum(stringIn :string) :Boolean{
        return /^\d+\.\d+$/.test(stringIn);
    }
}