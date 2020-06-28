import {expect} from "chai";
import { Routes } from "../../src/config/Routes/routes";
import { Route } from "../../src/config/Routes/resources/Route";
import { RouteParamType, ParamDataTypes } from "../../src/config/Routes/resources/RouteParamType";

let routes :Routes;
describe('Routes', ()=> {
    beforeEach(()=>{
        routes = new Routes();
    })

    describe("buildRoutesArray()", ()=> {
        it('Should build routes array properly', (done)=>{
            routes.baseRoutes = [
                new Route()
                .setMethod("GET")
                .setPath("/")
                .setController("root")
                .setAction("index")
            ]
            let testRoutes = routes.buildRoutesArray();
            expect(testRoutes).to.be.an('array');
            expect(testRoutes.length).to.equal(1);
            expect(testRoutes[0] instanceof Route).to.equal(true)
            done();
        });
    });
    describe("formatRoutes()", ()=> {
        it('Should format routes properly', (done)=>{
            let testRoute = new Route()
            .setMethod("POST")
            .setPath("/examples/complex/:someParam")
            .setDescription("This endpoint is an example of what a more complex route might look like")
            .setCustomControllerPath("examples/examples.controller.ts")
            .setAction("index")
            .setPathParam([
                new RouteParamType()
                .setName("someParam")
                .setDescription("Some path param")
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
            ]);
            let formattedVals = routes.formatRoutes([testRoute]);
            expect(formattedVals).to.be.an("array")
            expect(formattedVals).to.deep.eq([{
                "method": "post",
                "path": "/examples/complex/:someParam",
                "action": "index",
                "description": "This endpoint is an example of what a more complex route might look like",
                "pathParams": [
                    {
                        "name": "someParam",
                        "description": "Some path param",
                        "required": true,
                        "type": "number"
                    }
                ],
                "queryParams": [
                    {
                        "name": "test",
                        "required": true,
                        "type": "string"
                    }
                ],
                "bodySchema": {
                    "group": {
                        "name": {
                            "name": "name",
                            "description": "The Name of the group",
                            "required": true,
                            "type": "string"
                        },
                        "Level": {
                            "name": "Level",
                            "description": "The level of the group",
                            "required": true,
                            "type": "string"
                        },
                        "members": [
                            {
                                "name": {
                                    "name": "name",
                                    "description": "The name of the group user",
                                    "required": true,
                                    "type": "string"
                                },
                                "level": {
                                    "name": "level",
                                    "description": "The level of the group user",
                                    "required": true,
                                    "type": "number"
                                }
                            }
                        ]
                    }
                }
            }]);
            done();
        });
    });
});