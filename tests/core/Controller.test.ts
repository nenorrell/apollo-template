import {expect} from "chai";
import { Apollo } from "../../src/config/Apollo";
import { MockApollo } from "../test-utils/MockApollo";
import {Controller} from "../../src/api/Controller";
import { mockRouteWithPathParams, mockRouteWithQueryParams, mockRouteWithBodyParams } from "../test-utils/MockRoute";
import { formatError } from "../../src/modules/utility";
import { RouteParam, ParamDataTypes } from "../../src/config/Routes/resources/RouteParam";

let controller :Controller;

describe('Controller', ()=> {
    beforeEach(()=>{
    });

    describe("validatePathParams()", ()=>{
        it("Should not throw error if param matches validations", (done)=>{
            MockApollo({
                req:{
                    params: {
                        userId: "1"
                    },
                    path: "/users/1"
                },
                currentRoute: mockRouteWithPathParams([{
                    name: "userId",
                    type: "number",
                    isRequired: true
                }])
            });
            controller = new Controller();
            expect(controller["validatePathParams"].bind(controller)).to.not.throw(); 
            done();
        });
        
        it("Should not throw error if multiple params matches validations", (done)=>{
            MockApollo({
                req:{
                    params: {
                        userId: "1",
                        otherParam: "someValue"
                    },
                    path: "/users/1"
                },
                currentRoute: mockRouteWithPathParams([
                    {
                        name: "userId",
                        type: "number",
                        isRequired: true
                    },
                    {
                        name: "otherParam",
                        type: "string",
                        isRequired: true
                    }
                ])
            });
            controller = new Controller();
            expect(controller["validatePathParams"].bind(controller)).to.not.throw(); 
            done();
        });
        
        it("Should convert path param number string to number", (done)=>{
            MockApollo({
                req:{
                    params: {
                        userId: "1"
                    },
                    path: "/users/1"
                },
                currentRoute: mockRouteWithPathParams([
                    {
                        name: "userId",
                        type: "number",
                        isRequired: true
                    }
                ])
            });
            controller = new Controller();
            expect(controller["validatePathParams"].bind(controller)).to.not.throw();
            expect(Apollo.req.params.userId).to.be.a("number");
            done();
        });
        
        it("Should convert path param boolean string to bool", (done)=>{
            MockApollo({
                req:{
                    params: {
                        someParam: "true"
                    },
                    path: "/path/true"
                },
                currentRoute: mockRouteWithPathParams([
                    {
                        name: "someParam",
                        type: "boolean",
                        isRequired: true
                    }
                ])
            });
            controller = new Controller();
            expect(controller["validatePathParams"].bind(controller)).to.not.throw();
            expect(Apollo.req.params.someParam).to.be.true;
            done();
        });
        
        it("Should throw error if param is required and not sent", (done)=>{
            MockApollo({
                req:{
                    params: {
                        userId: "test"
                    },
                    path: "/users/test"
                },
                currentRoute: mockRouteWithPathParams([
                    {
                        name: "userId",
                        type: "number",
                        isRequired: true
                    }
                ])
            });

            controller = new Controller();
            try{
                expect(controller["validatePathParams"].bind(controller)).to.throw();
                controller["validatePathParams"]();
            }
            catch(e){
                expect(e).to.deep.eq({ 
                    status: 400,
                    details: 'GET /users/test is not a valid request path'
                });
            }
            done();
        });
    });

    describe("validateQueryParams()", ()=>{
        it("Should not throw error if params match validations", (done)=>{
            MockApollo({
                req:{
                    query: {
                        someParam: "someParam"
                    },
                    path: "/some/route"
                },
                currentRoute: mockRouteWithQueryParams([{
                    name: "someParam",
                    type: "string",
                    isRequired: true
                }])
            });

            controller = new Controller();
            expect(controller["validateQueryParams"].bind(controller)).to.not.throw();
            done();
        });

        it("Should not throw error if params match validations (multiple query params)", (done)=>{
            MockApollo({
                req:{
                    query: {
                        someParam: "someParam",
                        someOtherParam: 1
                    },
                    path: "/some/route"
                },
                currentRoute: mockRouteWithQueryParams([
                    {
                        name: "someParam",
                        type: "string",
                        isRequired: true
                    },
                    {
                        name: "someOtherParam",
                        type: "number",
                        isRequired: true
                    }
                ])
            });

            controller = new Controller();
            expect(controller["validateQueryParams"].bind(controller)).to.not.throw();
            done();
        });
        
        it("Should not throw error if an optional param isn't sent", (done)=>{
            MockApollo({
                req:{
                    query: {
                        someParam: "someParam"
                    },
                    path: "/some/route"
                },
                currentRoute: mockRouteWithQueryParams([
                    {
                        name: "someParam",
                        type: "string",
                        isRequired: true
                    },
                    {
                        name: "someOtherParam",
                        type: "number",
                        isRequired: false
                    }
                ])
            });

            controller = new Controller();
            expect(controller["validateQueryParams"].bind(controller)).to.not.throw();
            done();
        });

        it("Should convert path param number string to number", (done)=>{
            MockApollo({
                req:{
                    query: {
                        numberParam: "2"
                    },
                    path: "/some/route"
                },
                currentRoute: mockRouteWithQueryParams([
                    {
                        name: "numberParam",
                        type: "number",
                        isRequired: true
                    }
                ])
            });
            controller = new Controller();
            expect(controller["validateQueryParams"].bind(controller)).to.not.throw();
            expect(Apollo.req.query.numberParam).to.be.a("number");
            done();
        });
        
        it("Should convert path param boolean string to bool", (done)=>{
            MockApollo({
                req:{
                    query: {
                        booleanParam: "true"
                    },
                    path: "/some/route"
                },
                currentRoute: mockRouteWithQueryParams([
                    {
                        name: "booleanParam",
                        type: "boolean",
                        isRequired: true
                    }
                ])
            });
            controller = new Controller();
            expect(controller["validateQueryParams"].bind(controller)).to.not.throw();
            expect(Apollo.req.query.booleanParam).to.be.true;
            done();
        });
        
        it("Should throw error if params are required and are not sent", (done)=>{
            MockApollo({
                req:{
                    query: {
                        someParam: "someParam"
                    },
                    path: "/some/route"
                },
                currentRoute: mockRouteWithQueryParams([
                    {
                        name: "someParam",
                        type: "string",
                        isRequired: true
                    },
                    {
                        name: "someOtherParam",
                        type: "number",
                        isRequired: true
                    }
                ])
            });

            controller = new Controller();
            try{
                expect(controller["validateQueryParams"].bind(controller)).to.throw();
                controller["validateQueryParams"]();
            }
            catch(e){
                expect(e).to.deep.eq({ 
                    status: 400,
                    details: 'someOtherParam was not sent and is required'
                });
            }
            done();
        });
        
        it("Should throw error if params values do not match expected type", (done)=>{
            MockApollo({
                req:{
                    query: {
                        someParam: "someParam",
                        someOtherParam: "some string"
                    },
                    path: "/some/route"
                },
                currentRoute: mockRouteWithQueryParams([
                    {
                        name: "someParam",
                        type: "string",
                        isRequired: true
                    },
                    {
                        name: "someOtherParam",
                        type: "number",
                        isRequired: true
                    }
                ])
            });

            controller = new Controller();
            try{
                expect(controller["validateQueryParams"].bind(controller)).to.throw(); 
                controller["validateQueryParams"]();
            }
            catch(e){
                expect(e).to.deep.eq({
                    status: 400,
                    details: 'Invalid param type for someOtherParam: Expected number but got string'
                });
            }
            done();
        });
    });

    describe("validateReqBody()", ()=>{
        let paramsWithChildren;

        before(()=>{
            paramsWithChildren = [
                new RouteParam()
                .setName("name")
                .setRequired(true)
                .setType(ParamDataTypes.string),

                new RouteParam()
                .setName("children")
                .setRequired(true)
                .setType(ParamDataTypes.object)
                .setChildren([
                    new RouteParam()
                    .setName("child1")
                    .setRequired(true)
                    .setType(ParamDataTypes.string),
    
                    new RouteParam()
                    .setName("child2")
                    .setRequired(false)
                    .setType(ParamDataTypes.number)
                ])
            ]
        });

        it("Should not throw error if body params match validations", (done)=>{
            MockApollo({
                req:{
                    body: {
                        name: "test",
                        children:{
                            child1: "someString",
                            child2: "1"
                        }
                    },
                    path: "/some/route"
                },
                currentRoute: mockRouteWithBodyParams(paramsWithChildren)
            });

            controller = new Controller();
            expect(controller["validateReqBody"].bind(controller)).to.not.throw();
            done();
        });
        
        it("Should not throw error if an optional param isn't sent", (done)=>{
            MockApollo({
                req:{
                    body: {
                        name: "test",
                        children:{
                            child1: "someString"
                        }
                    },
                    path: "/some/route"
                },
                currentRoute: mockRouteWithBodyParams(paramsWithChildren)
            });

            controller = new Controller();
            expect(controller["validateReqBody"].bind(controller)).to.not.throw();
            done();
        });

        it("Should convert body param number string to number", (done)=>{
            MockApollo({
                req:{
                    body: {
                        name: "test",
                        children:{
                            child1: "someString",
                            child2: "1"
                        }
                    },
                    path: "/some/route"
                },
                currentRoute: mockRouteWithBodyParams(paramsWithChildren)
            });
            controller = new Controller();
            expect(controller["validateReqBody"].bind(controller)).to.not.throw();
            expect(Apollo.req.body.children.child2).to.be.a("number");
            done();
        });
        
        it("Should throw error if params are required and are not sent", (done)=>{
            MockApollo({
                req:{
                    body: {
                        name: "test",
                        children:{
                            child2: "1"
                        }
                    },
                    path: "/some/route"
                },
                currentRoute: mockRouteWithBodyParams(paramsWithChildren)
            });

            controller = new Controller();
            try{
                expect(controller["validateReqBody"].bind(controller)).to.throw();
                controller["validateReqBody"]();
            }
            catch(e){
                expect(e).to.deep.eq({ 
                    status: 400,
                    details: 'child1 was not sent and is required'
                });
            }
            done();
        });
        
        it("Should throw error if params values do not match expected type", (done)=>{
            MockApollo({
                req:{
                    body: {
                        name: "test",
                        children:{
                            child1: "someString",
                            child2: "Invalid param value"
                        }
                    },
                    path: "/some/route"
                },
                currentRoute: mockRouteWithBodyParams(paramsWithChildren)
            });

            controller = new Controller();
            try{
                expect(controller["validateReqBody"].bind(controller)).to.throw(); 
                controller["validateReqBody"]();
            }
            catch(e){
                expect(e).to.deep.eq({
                    status: 400,
                    details: 'Invalid param type for child2: Expected number but got string'
                });
            }
            done();
        });
    });
});