import {Route} from './resources/Route';
import { RouteParam, ParamDataTypes } from './resources/RouteParam';
import { cleanObject, getEnumValue } from '../../modules/utility';
import { RouteTagOptions } from './resources/RouteTagOptions';

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

    public getFormattedRoutes() :Array<any>{
        let formatted = this.formatRoutes(this.routesArray);
        return this.sortRoutes(this.processRoutes(formatted));
    }
    
    public processRoutes(routes :Array<any>) :Array<any>{
        return routes.map((route)=>{
            if(route.tag){ // Is a group of routes
                this.sortRoutes(route.routes);
            }
            return route; // Is a route obj
        });
    }

    public sortRoutes(routes) :Array<Route>{
        return routes.sort((a,b)=>{
            let route1 = a.path ? a.path.replace(/[.-]/, '') : '';
            let route2 = b.path ? b.path.replace(/[.-]/, '') : '';
            return route1>route2 ? 1 : -1;
        });
    }

    public sortRouteGroups(routes) :Array<any>{
        return routes.sort((a,b)=>{
            return a.tag<b.tag ? 1 : -1;
        });
    }

    public formatRoutes(routes :Array<Route>) :Array<any>{
        let groupedRoutes :Map<string, Array<any>> = new Map();
        let ungroupedRoutes :Array<any> = [];
        
        routes.forEach((route)=>{
            let formattedObj = {
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
            if(formattedObj.pathParams){
                this.cleanRouteParams(formattedObj.pathParams)
            }
            if(formattedObj.queryParams){
                this.cleanRouteParams(formattedObj.queryParams)
            }
            if(formattedObj.bodySchema){
                cleanObject(formattedObj.bodySchema)
            }
            cleanObject(formattedObj);

            if(typeof route.tag !== "undefined"){
                let tag = getEnumValue(RouteTagOptions, route.tag);
                if(groupedRoutes.has(tag)){
                    let group = groupedRoutes.get(tag);
                    group.push(formattedObj)
                    groupedRoutes.set(tag, group);
                }
                else{
                    groupedRoutes.set(tag, [formattedObj]);
                }
            }
            else{
                ungroupedRoutes.push(formattedObj);
            }
        });
        let groupedRoutesArray = Array.from(groupedRoutes, ([tag, routes]) => ({ tag, routes }));
        return [...ungroupedRoutes, ...this.sortRouteGroups(groupedRoutesArray)];
    }

    private cleanRouteParams(params :Array<RouteParam>){
        params.forEach((param)=>{
            cleanObject(param);
        })
    }
}