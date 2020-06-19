import {Route} from './Route';

export class Routes{
    private root :Route = new Route("GET", "/", "root", "index");
    private version :Route = new Route("GET", "/version", "version", "getVersion");
    private apiDoc :Route = new Route("GET", "/api/doc", "api-docs", "displayRoutes");

    public buildRoutesArray() :Array<Route>{
        const baseRoutes :Array<Route> = [
            this.root,
            this.version,
            this.apiDoc
        ];

        return [...baseRoutes];
    }
}