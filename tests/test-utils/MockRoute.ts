import { RouteParam, ParamDataTypes } from "../../src/config/Routes/resources/RouteParam";
import { Route } from "../../src/config/Routes/resources/Route";

interface IMockParam{
    name ?:string
    type ?: ParamDataTypes
    isRequired ?:boolean
    enumValues ?:Array<string | number | boolean>
}

export const mockRouteWithPathParams = (config :Array<IMockParam>) :Route =>{
    return new Route()
    .setMethod("GET")
    .setPathParams(mockRouteParams(config));
}

export const mockRouteWithQueryParams = (config :Array<IMockParam>) :Route =>{
    return new Route()
    .setMethod("GET")
    .setQueryParams(mockRouteParams(config));
}

export const mockRouteWithBodyParams = (params :Array<RouteParam>) :Route =>{
    return new Route()
    .setMethod("POST")
    .setBodySchema(params);
}

export const mockRouteParams = (config) :Array<RouteParam> =>{
    return config.map((param)=> mockRouteParam(param));
}

export const mockRouteParam = ({name,type,isRequired,enumValues}:IMockParam) :RouteParam =>{
    let param = new RouteParam()
    .setName(name || "someParam")
    .setType(type !== undefined ? type : ParamDataTypes.string)
    .setRequired(isRequired || false);
    if(enumValues){
        param.setEnumValues(enumValues);
    }
    return param;
}