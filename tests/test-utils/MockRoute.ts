import { RouteParam, ParamDataTypes } from "../../src/config/Routes/resources/RouteParam";
import { Route } from "../../src/config/Routes/resources/Route";

export const mockRouteWithPathParams = (config :Array<any>) :Route =>{
    return new Route()
    .setMethod("GET")
    .setPathParams(mockRouteParams(config));
}

export const mockRouteWithQueryParams = (config :Array<any>) :Route =>{
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

export const mockRouteParam = (param) :RouteParam =>{
    return new RouteParam()
    .setName(param.name || "someParam")
    .setType(param.type ?  (<any>ParamDataTypes)[param.type] : ParamDataTypes.string)
    .setRequired(param.isRequired || false)
}