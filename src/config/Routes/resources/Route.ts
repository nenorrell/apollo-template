import { RouteParamType, ParamDataTypes } from "./RouteParamType";

export class Route {
    public path :PropertyKey;
    public method :PropertyKey;
    public controller :string;
    public customControllerPath :string;
    public action :PropertyKey;
    public policies :Array<string>;
    public description :string;
    public pathParams :Array<RouteParamType>;
    public queryParams :Array<RouteParamType>;
    public bodySchema :Array<RouteParamType>;
    public formattedPathParams :any;    
    public formattedBodySchema :any;
    public formattedQueryParams :any;

    public setMethod(method :PropertyKey) :Route{
        this.method = method.toString().toLocaleLowerCase();
        return this;
    }

    public setPath(path :PropertyKey) :Route{
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

    public setPolicies(policies :Array<string>) :Route{
        this.policies = policies;
        return this;
    }

    public setDescription(description :string) :Route{
        this.description = description;
        return this;
    }

    public setPathParam(params :Array<RouteParamType>) :Route{
        this.pathParams = params;
        this.formattedPathParams = this.formatParams(params);
        return this;
    }

    public setQueryParams(queryParams :Array<RouteParamType>) :Route{
        this.queryParams = queryParams;
        this.formattedQueryParams = this.formatParams(queryParams);
        return this;
    }

    public setBodySchema(bodySchema :Array<RouteParamType>) :Route{
        this.bodySchema = bodySchema;
        this.formattedBodySchema = this.buildSchema(bodySchema);
        return this;
    }

    private formatParams(queryParams :Array<RouteParamType>) :any{
        return queryParams.map((param)=>{
            return this.formatParam(param);
        });
    }

    private buildSchema(level :Array<RouteParamType>) :any{
        let schema :any = {};
        level.forEach((item)=>{
            schema[item.name] = this.buildBodySchemaLevel(item)
        });
        return schema;
    }

    private buildBodySchemaLevel(item :RouteParamType) :any{
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
    
    private formatParam(item :RouteParamType) :any{
        return {
            name: item.name,
            description: item.description,
            required: item.required,
            type: item.typeDisplayValue
        }
    }
}