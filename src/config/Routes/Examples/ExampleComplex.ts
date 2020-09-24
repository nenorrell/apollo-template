import { Route } from "../resources/Route";
import { RouteParam, ParamDataTypes } from "../resources/RouteParam";
import { PolicyOptions } from "../Policies";

export const ComplexRoute :Route = new Route()
.setMethod("POST")
.setPath("/examples/complex/:someParam")
.setDescription("This endpoint is an example of what a more complex route might look like")
// .setPolicies([PolicyOptions.isAuthenticated])
.setCustomControllerPath("examples/examples.controller.ts")
.setAction("index")
.setPathParams([
    new RouteParam()
    .setName("someParam")
    .setType(ParamDataTypes.number)
    .setRequired(true)
])
.setQueryParams([
    new RouteParam()
    .setName("test")
    .setRequired(true)
    .setType(ParamDataTypes.string)
])
.setBodySchema([
    new RouteParam()
    .setName("group")
    .setDescription("Group object")
    .setRequired(true)
    .setType(ParamDataTypes.object)
    .setChildren([
        new RouteParam()
        .setName("name")
        .setDescription("The Name of the group")
        .setRequired(true)
        .setType(ParamDataTypes.string),

        new RouteParam()
        .setName("Level")
        .setDescription("The level of the group")
        .setRequired(true)
        .setType(ParamDataTypes.string),

        new RouteParam()
        .setName("members")
        .setDescription("An array of the group members")
        .setRequired(true)
        .setType(ParamDataTypes.object)
        .setChildren([
            new RouteParam()
            .setName("name")
            .setDescription("The name of the group user")
            .setRequired(true)
            .setType(ParamDataTypes.string),

            new RouteParam()
            .setName("level")
            .setDescription("The level of the group user")
            .setRequired(true)
            .setType(ParamDataTypes.number)
        ])
    ])
])