import {Route} from './resources/Route';
import { RouteParam, ParamDataTypes } from './resources/RouteParam';
import { cleanObject } from '../../modules/utility';

export class Routes{
    private root :Route = new Route()
    .setMethod("GET")
    .setPath("/")
    .setController("root")
    .setAction("index")

    private version :Route = new Route()
    .setMethod("GET")
    .setPath("/version")
    .setController("version")
    .setAction("getVersion")
    .setDescription("This endpoint will display the current Git Hash you have checked out.");

    private certChallenge :Route = new Route()
    .setMethod("GET")
    .setPath("/.well-known/acme-challenge/:challengeString")
    .setPathParams([
        new RouteParam()
        .setName("challengeString")
        .setType(ParamDataTypes.string)
        .setRequired(true)
    ])
    .setController("root")
    .setAction("certbot")
    .setExcludedEnvironments(["local", "qa"])
    .setDescription("This endpoint is only for certbot to authenticate against")

    private apiDocs :Route = new Route()
    .setMethod("GET")
    .setPath("/api/docs")
    .setExcludedEnvironments(['prod'])
    .setDescription("This endpoint will display currently configured routes")
    .setController("api-docs")
    .setAction("displayRoutes");

    public baseRoutes :Array<Route> = [
        this.root,
        this.version,
        this.apiDocs,
        this.certChallenge
    ];

    public routesArray :Array<Route> = [
        ...this.baseRoutes
    ]

    public getFormattedRoutes() :Array<Route>{
        return this.formatRoutes(this.routesArray);
    }
    
    public formatRoutes(routes :Array<Route>) :Array<any>{
        return routes.map((route)=>{
            let returnObj = {
                method: route.method,
                path: route.path,
                controller: route.controller,
                action: route.action,
                policies: route.getDisplayPolicies(),
                description: route.description,
                pathParams: route.getFormattedPathParams(),
                queryParams: route.getFormattedQueryParams(),
                bodySchema: route.getFormattedBodySchema()
            }
            if(returnObj.pathParams){
                this.cleanRouteParams(returnObj.pathParams)
            }
            if(returnObj.queryParams){
                this.cleanRouteParams(returnObj.queryParams)
            }
            if(returnObj.bodySchema){
                cleanObject(returnObj.bodySchema)
            }
            cleanObject(returnObj);
            return returnObj;
        });
    }

    private cleanRouteParams(params :Array<RouteParam>){
        params.forEach((param)=>{
            cleanObject(param);
        })
    }
}