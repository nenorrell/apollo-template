export enum ParamDataTypes{
    'boolean',
    'number',
    'string',
    'object',
    'array'
}

export class RouteParam{
    public name :string;
    public children :Array<RouteParam>;
    public required :Boolean;
    public type :ParamDataTypes;
    public description :string;
    private typeDisplayValue :string;

    public setName(name :string) :RouteParam{
        this.name = name;
        return this;
    }
    public setChildren(children :Array<RouteParam>) :RouteParam{
        this.children = children;
        return this;
    }
    public setRequired(required :Boolean) :RouteParam{
        this.required = required;
        return this;
    }
    public setType(type :ParamDataTypes) :RouteParam{
        this.type = type;
        this.typeDisplayValue = ParamDataTypes[type];
        return this;
    }
    public setDescription(description :string) :RouteParam{
        this.description = description;
        return this;
    }

    public getTypeDisplayValue() :string{
        return this.typeDisplayValue;
    }
}