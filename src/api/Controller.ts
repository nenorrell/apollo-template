import {Request, Response, NextFunction, request, query} from 'express';
import { Responses } from '../config/Responses';
import { Route } from '../config/Routes/resources/Route';
import { RouteParam, ParamDataTypes} from '../config/Routes/resources/RouteParam';
import { formatError, asyncForEach } from '../modules/utility';
import { Policies, readPolicy } from '../config/Routes/resources/Policies';
import { Apollo } from '../config/Apollo';

export class Controller{
    protected responses :Responses;
    protected req :Request = Apollo.req;
    protected currentRoute :Route = Apollo.currentRoute;
    protected res :Response = Apollo.res;
    protected next :NextFunction = Apollo.next;
    protected route :Route = Apollo.currentRoute;

    constructor(){
        this.responses = new Responses(this.res);
    }

    public async checkPolicies(){
        let policies = new Policies();
        if(this.route.policies){
            await asyncForEach(this.route.policies, async policyName => {
                await policies.runPolicy(readPolicy(policyName))
            });
        }
    }

    public runValidations() :void{
        try{
            this.validatePathParams();
            this.validateQueryParams();
            this.validateReqBody();
        }
        catch(e){
            throw e;
        }
    }

    private validatePathParams() :void{
        try{
            if(this.route.pathParams){
                this.route.pathParams.forEach((param :RouteParam)=>{
                    let pathParam = this.req.params[param.name];
                    this.validatePathParamType(param, pathParam);
                    this.req.params[param.name] = this.convertType(param.type, pathParam);
                });
            }
        }
        catch(e){
            throw e;
        }
    }

    private validateQueryParams() :void{
        try{
            if(this.route.queryParams){
                this.route.queryParams.forEach((param :RouteParam)=>{
                    let queryParam = this.req.query[param.name];
                    this.validateRequiredParam(param, queryParam);
                    if(typeof queryParam != "undefined"){
                        this.validateParamType(param, queryParam);
                        this.req.query[param.name] = this.convertType(param.type, queryParam);
                        this.validateEnumParam(param, queryParam);
                    }
                });
            }
        }
        catch(e){
            throw e;
        }
    }

    private validateReqBody() :void{
        try{
            if(this.route.bodySchema){
                if(!this.req.body){
                    throw formatError(400, "Payload is expected");
                }
                this.validateReqBodyParams(this.route.bodySchema, null, this.req.body)
            }
        }
        catch(e){
            throw e;
        }
    }

    private validateReqBodyParams(schema :Array<RouteParam>, ancestor ?:RouteParam, obj ?:any) :void{                
        schema.forEach((param)=>this.validateReqBodyParam(param, ancestor, obj));
    }

    private validateReqBodyParam(schemaLevel :RouteParam, ancestor ?:RouteParam, obj ?:any){
        if(ancestor){
            if(Array.isArray(obj)){
                obj.forEach((row)=>{
                    this.processBodyReqRow(schemaLevel, row)
                })
            }
            else{
                this.processBodyReqRow(schemaLevel, obj)
            }
        }
        else{
            this.processBodyReqRow(schemaLevel, this.req.body)
        }

        if(schemaLevel.children){
            if(Array.isArray(obj)){
                obj.forEach((row)=>{
                    this.validateReqBodyParams(schemaLevel.children, schemaLevel, row[schemaLevel.name])    
                })
            }
            else{
                this.validateReqBodyParams(schemaLevel.children, schemaLevel, obj[schemaLevel.name])
            }
        }
    }

    private processBodyReqRow(schemaLevel :RouteParam, row ?:any){
        this.validateRequiredParam(schemaLevel, row[schemaLevel.name]);
        if(typeof row[schemaLevel.name] != "undefined"){
            this.validateParamType(schemaLevel, row[schemaLevel.name]);
            row[schemaLevel.name] = this.convertType(schemaLevel.type, row[schemaLevel.name]);
        }
    }

    private validateRequiredParam(param :RouteParam, requestParam :any) :void{
        if(param.required && !requestParam){
            let err = `${param.name} was not sent and is required`;
            throw formatError(400, err);
        }
    }

    private validateEnumParam(param :RouteParam, requestParam :any) :void{
        if(requestParam && param.type === ParamDataTypes.enum){
            let filtered = param.enumValues.filter((val)=>
                val === requestParam
            );
            
            if(filtered.length === 0){
                let err = `Invalid enum value for ${param.name}: ${requestParam}`;
                throw formatError(400, err);
            }
        }
    }

    private validateParamType(param :RouteParam, requestParam :any) :void{
        if(requestParam){
            if(!this.isValidTypes(param.type, requestParam)){
                let err = `Invalid param type for ${param.name}: Expected ${param.getTypeDisplayValue()} but got ${typeof requestParam}`;
                throw formatError(400, err);
            }
        }
    }

    private validatePathParamType(param :RouteParam, requestParam :any) :void{
        if(requestParam){
            if(!this.isValidTypes(param.type, requestParam)){
                let err = `${this.route.method.toString().toUpperCase()} ${this.req.path} is not a valid request path`;
                throw formatError(400, err);
            }
        }
    }
    
    private isValidTypes(type :ParamDataTypes, paramValue :any) :Boolean{
        let isValid :Boolean = true;
        switch(type){
            case ParamDataTypes.boolean:
                try{
                    let value = typeof paramValue == "string" ? this.parseBool(paramValue) : paramValue;
                    if(typeof value !== "boolean"){
                        isValid = false;
                    }
                }
                catch(e){
                    isValid = false;
                }
                break;
            
            case ParamDataTypes.number:
                if(isNaN(parseInt(paramValue))){
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
                isValid = true;
        }

        return isValid;
    }
    
    private convertType(type :ParamDataTypes, paramValue :any) :any{
        switch(type){
            case ParamDataTypes.boolean:
                return this.parseBool(paramValue);
            
            case ParamDataTypes.number:
                return (+paramValue);

            default:
                return paramValue;
        }
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
}