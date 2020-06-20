import { Route } from "../resources/Route";
import { RouteParamType, ParamDataTypes } from "../resources/RouteParamType";

export const ComplexRoute :Route = new Route()
.setMethod("GET")
.setPath("/examples/complex")
.setDescription("This endpoint is an example of what a more complex route might look like")
.setController("examples")
.setAction("complexExample")
.setQueryParams([
    new RouteParamType()
    .setName("test")
    .setRequired(true)
    .setType(ParamDataTypes.number)
])
.setBodySchema([
    new RouteParamType()
    .setName("group")
    .setDescription("Group object")
    .setRequired(true)
    .setType(ParamDataTypes.object)
    .setChildren([
        new RouteParamType()
        .setName("name")
        .setDescription("The Name of the group")
        .setRequired(true)
        .setType(ParamDataTypes.string),

        new RouteParamType()
        .setName("Level")
        .setDescription("The level of the group")
        .setRequired(true)
        .setType(ParamDataTypes.string),

        new RouteParamType()
        .setName("members")
        .setDescription("The level of the group")
        .setRequired(true)
        .setType(ParamDataTypes.array)
        .setChildren([
            new RouteParamType()
            .setName("name")
            .setDescription("The name of the group user")
            .setRequired(true)
            .setType(ParamDataTypes.string),

            new RouteParamType()
            .setName("level")
            .setDescription("The level of the group user")
            .setRequired(true)
            .setType(ParamDataTypes.number)
        ])
    ])
])