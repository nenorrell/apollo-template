import { RouteParamType } from "./RouteParamType";

export interface RouteInterface{
    path :PropertyKey;
    method :PropertyKey;
    controller :string;
    action :PropertyKey;
    description ?:string;
    queryParams ?:Array<RouteParamType>;
    responseStructure ?:any;
}