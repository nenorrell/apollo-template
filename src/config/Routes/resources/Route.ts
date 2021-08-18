import { RouteParam, ParamDataTypes } from "./RouteParam";
import { readPolicy, PolicyOptions } from "./Policies";
import { RouteTagOptions } from "./RouteTagOptions";
import { HttpMethod } from "../../resources/Common";
import { ApolloResponseType } from "../../resources/IResponses";

/** @class Configure a route for the application */
export class Route {
    public path :string;
    public method :PropertyKey;
    public controller :string;
    public customControllerPath :string;
    public action :PropertyKey;
    public policies :Array<PolicyOptions>;
    public description :string;
    public tag :RouteTagOptions;
    public pathParams :Array<RouteParam>;
    public queryParams :Array<RouteParam>;
    public bodySchema :Array<RouteParam>;
    private displayPolicies :Array<string>;
    private formattedPathParams :any;    
    private formattedBodySchema :any;
    private formattedQueryParams :any;
    public excludedEnvironments :Array<string>;
    public hideFromDocs :boolean;
    public queryParamKeys :Array<string> = [];
    public exampleResponse :ApolloResponseType;

    public setMethod(method :HttpMethod) :Route{
        this.method = method.toString().toLocaleLowerCase();
        return this;
    }

    public setPath(path :string) :Route{
        this.path = path;
        return this;
    }

    // Mutually exclusive to this.controller
    // Controller is still expected to be in the api folder
    public setCustomControllerPath(customControllerPath :string) :Route{
        this.customControllerPath = customControllerPath;
        return this;
    }

    // Mutually exclusive to this.customControllerPath
    public setController(controller :string) :Route{
        this.controller = controller;
        return this;
    }

    public setAction(action :PropertyKey) :Route{
        this.action = action;
        return this;
    }

    public setPolicies(policies :Array<PolicyOptions>) :Route{
        this.policies = policies;
        this.displayPolicies = policies.map((policy :PolicyOptions)=>{
            return readPolicy(policy);
        });
        return this;
    }

    public setDescription(description :string) :Route{
        this.description = description;
        return this;
    }

    public setTag(tag :RouteTagOptions) :Route{
        this.tag = tag;
        return this;
    }

    public setPathParams(params :Array<RouteParam>) :Route{
        this.pathParams = params;
        this.formattedPathParams = this.formatParams(params);
        return this;
    }

    public setQueryParams(queryParams :Array<RouteParam>) :Route{
        this.queryParams = queryParams;
        this.formattedQueryParams = this.formatParams(queryParams);
        this.queryParams.forEach((param)=>{
            this.queryParamKeys.push(param.name);
        });
        return this;
    }

    public setBodySchema(bodySchema :Array<RouteParam>) :Route{
        this.bodySchema = bodySchema;
        this.formattedBodySchema = this.buildSchema(bodySchema);
        return this;
    }

    public setExcludedEnvironments(environments :Array<string>) :Route{
        this.excludedEnvironments = environments;
        return this;
    }

    public setHideFromDocs(hideFromDocs :boolean) :Route{
        this.hideFromDocs = hideFromDocs;
        return this;
    }

    public setExampleResponse(exampleResponse :ApolloResponseType) :Route{
        this.exampleResponse = exampleResponse;
        return this;
    }

    public getDisplayPolicies() :Array<string>{
        return this.displayPolicies;
    }

    public getFormattedPathParams() :any{
        return this.formattedPathParams;
    }

    public getFormattedQueryParams() :any{
        return this.formattedQueryParams;
    }

    public getFormattedBodySchema() :any{
        return this.formattedBodySchema;
    }

    /** A shortcut for determining if a route
     * has a specific query param configured for it
     * 
     * WILL NOT DETECT IF THE REQUEST HAS A QUERY PARAM
     * PRESENT
     * 
     * @param key - Param key to search for
     */
    public hasQueryParam(key :string) :boolean{
        return this.queryParamKeys.includes(key);
    }

    private formatParams(queryParams :Array<RouteParam>) :any{
        return queryParams.map((param)=>{
            return this.formatParam(param);
        });
    }

    private buildSchema(level :Array<RouteParam>) :any{
        let schema :any = {};
        level.forEach((item)=>{
            schema[item.name] = this.buildBodySchemaLevel(item)
        });
        return schema;
    }

    private buildBodySchemaLevel(item :RouteParam) :any{
        let obj :any = {};
        if(item.children){
            if(item.type === ParamDataTypes.object){
                obj = this.buildSchema(item.children);
            }    
            else{
                obj = [this.buildSchema(item.children)];
            }
        }
        else{
            obj = this.formatParam(item);
        }
        return obj;
    }
    
    private formatParam(item :RouteParam) :any{
        let obj = {
            name: item.name,
            description: item.description,
            required: item.required || false,
            type: item.getTypeDisplayValue()
        }
        if(item.type === ParamDataTypes.enum){
            obj['enumValues'] = item.enumValues;
        }
        return obj;
    }
}