import {Route} from './resources/Route';
import { RouteParamType, ParamDataTypes } from './resources/RouteParamType';
// import { ComplexRoute } from './Examples/ExampleComplex';
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

    private apiDoc :Route = new Route()
    .setMethod("GET")
    .setPath("/api/doc")
    .setDescription("This endpoint will display currently configured routes")
    .setController("api-docs")
    .setAction("displayRoutes");

    public baseRoutes :Array<Route> = [
        this.root,
        this.version,
        this.apiDoc
        // ComplexRoute
    ];

    public getFormattedRoutes() :Array<Route>{
        return this.formatRoutes([
            ...this.baseRoutes
        ]);
    }
    

    public buildRoutesArray() :Array<Route>{
        // Return custom routes like
        // [...baseRoutes, ...userRoots, ...adminRoutes]
        return [...this.baseRoutes];
    }
    
    public formatRoutes(routes :Array<Route>) :Array<any>{
        return routes.map((route)=>{
            let returnObj = {
                method: route.method,
                path: route.path,
                controller: route.controller,
                action: route.action,
                description: route.description,
                pathParams: route.formattedPathParams,
                queryParams: route.formattedQueryParams,
                bodySchema: route.formattedBodySchema
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

    private cleanRouteParams(params :Array<RouteParamType>){
        params.forEach((param)=>{
            cleanObject(param);
        })
    }
}