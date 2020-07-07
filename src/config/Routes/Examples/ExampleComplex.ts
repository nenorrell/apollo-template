import { Route } from "../resources/Route";
import { RouteParamType, ParamDataTypes } from "../resources/RouteParamType";
import { PolicyOptions } from "../Policies";

export const ComplexRoute :Route = new Route()
.setMethod("POST")
.setPath("/examples/complex/:someParam")
.setDescription("This endpoint is an example of what a more complex route might look like")
// .setPolicies([PolicyOptions.isAuthenticated])
.setCustomControllerPath("examples/examples.controller.ts")
.setAction("index")
.setPathParam([
    new RouteParamType()
    .setName("someParam")
    .setType(ParamDataTypes.number)
    .setRequired(true)
])
.setQueryParams([
    new RouteParamType()
    .setName("test")
    .setRequired(true)
    .setType(ParamDataTypes.string)
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