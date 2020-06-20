import {Route} from './resources/Route';
import { RouteParamType, ParamDataTypes } from './resources/RouteParamType';
import { ComplexRoute } from './Examples/ExampleComplex';

export class Routes{
    private root :Route = new Route()
    .setMethod("GET")
    .setPath("/")
    .setController("root")
    .setAction("index");

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

    public buildRoutesArray() :Array<any>{
        const baseRoutes :Array<Route> = [
            this.root,
            this.version,
            this.apiDoc,
            ComplexRoute
        ];

        return this.formatRoutes([
            ...baseRoutes
        ]);
    }
    
    public formatRoutes(routes :Array<Route>) :Array<any>{
        return routes.map((route)=>{
            return {
                method: route.method,
                path: route.path,
                controller: route.controller,
                action: route.action,
                description: route.description,
                queryParams: route.queryParamsStructure,
                bodySchema: route.bodySchemaStructure
            }
        });
    }
}