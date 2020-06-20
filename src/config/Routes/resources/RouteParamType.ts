export enum ParamDataTypes{
    'boolean',
    'number',
    'string',
    'object',
    'array'
}

export class RouteParamType{
    public name :string;
    public children :Array<RouteParamType>;
    public required :Boolean;
    public type :ParamDataTypes;
    public typeDisplayValue :string;
    public description :string;

    public setName(name :string) :RouteParamType{
        this.name = name;
        return this;
    }
    public setChildren(children :Array<RouteParamType>) :RouteParamType{
        this.children = children;
        return this;
    }
    public setRequired(required :Boolean) :RouteParamType{
        this.required = required;
        return this;
    }
    public setType(type :ParamDataTypes) :RouteParamType{
        this.type = type;
        this.typeDisplayValue = ParamDataTypes[type];
        return this;
    }
    public setDescription(description :string) :RouteParamType{
        this.description = description;
        return this;
    }
}