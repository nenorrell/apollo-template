import { RouteInterface } from "./RouteInterface";
import { RouteParamType, ParamDataTypes } from "./RouteParamType";

export class Route implements RouteInterface{
    public path :PropertyKey;
    public method :PropertyKey;
    public controller :string;
    public action :PropertyKey;
    public description :string;
    public queryParams :Array<RouteParamType>;
    public queryParamsStructure :any;
    public bodySchema :Array<RouteParamType>;
    public bodySchemaStructure :any;
    
    constructor(){
    }

    public setMethod(method :PropertyKey) :Route{
        this.method = method.toString().toLocaleLowerCase();
        return this;
    }

    public setPath(path :PropertyKey) :Route{
        this.path = path;
        return this;
    }

    public setController(controller :string) :Route{
        this.controller = controller;
        return this;
    }

    public setAction(action :PropertyKey) :Route{
        this.action = action;
        return this;
    }

    public setDescription(description :string) :Route{
        this.description = description;
        return this;
    }

    public setQueryParams(queryParams :Array<RouteParamType>) :Route{
        this.queryParams = queryParams;
        this.queryParamsStructure = this.formatQueryParams(queryParams);
        return this;
    }

    public setBodySchema(bodySchema :Array<RouteParamType>) :Route{
        this.bodySchema = bodySchema;
        this.bodySchemaStructure = this.buildSchema(bodySchema);
        return this;
    }

    private formatQueryParams(queryParams :Array<RouteParamType>){
        return queryParams.map((param)=>{
            return {
               name: param.name,
               description: param.description,
               required: param.required,
               type: param.type
           } 
        });
    }

    private buildSchema(level :Array<RouteParamType>){
        let schema :any = {};
        level.forEach((item)=>{
            schema[item.name] = this.buildBodySchemaLevel(item)
        });
        return schema;
    }

    private buildBodySchemaLevel(item :RouteParamType){
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
            obj = this.parseBodySchemaLevel(item)
        }
        return obj;
    }
    
    private parseBodySchemaLevel(item){
        return {
            name: item.name,
            description: item.description,
            required: item.required,
            type: item.typeDisplayValue
        }
    }
}