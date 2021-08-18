export enum ParamDataTypes{
    'boolean',
    'number',
    'string',
    'object',
    'array',
    'enum'
}

/**
 * @class Defines a route param for Apollo to pickup.
 * Could be a param in the path, body, or a query param */
export class RouteParam{
    public name :string;
    public children :Array<RouteParam>;
    public required :Boolean;
    public type :ParamDataTypes;
    public enumValues :Array<string | number | boolean>;
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
    public setEnumValues(values :Array<string | number | boolean>) :RouteParam{
        this.enumValues = values;
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