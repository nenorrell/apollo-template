import {expect} from "chai";
import { MockApollo } from "../test-utils/MockApollo";
import { Service } from "../../src/api/Service";
import * as utility from "../../src/modules/utility";
import Sinon, { mock } from "sinon";
let service :Service;

describe('Service', ()=> {
    describe("getPaginationParams()", ()=>{    
        it("Should build pagination properties properly for first page", (done)=>{
            MockApollo({
                req: {
                    query: {
                        page: 1,
                        pageSize: 25
                    }
                },
                currentRoute: {
                    queryParamKeys: ["page","pageSize"],
                    hasQueryParam: ()=>{return true}
                }
            });
            service = new Service();

            expect(service["getPaginationParams"]()).to.deep.equal({
                limit: 25,
                skip: 0
            })
            done();
        });
        
        it("Should build pagination properties properly for subsequent pages", (done)=>{
            MockApollo({
                req: {
                    query: {
                        page: 3,
                        pageSize: 25
                    },
                },
                currentRoute: {
                    queryParamKeys: ["page","pageSize"],
                    hasQueryParam: ()=>{return true}
                }
            });
            service = new Service();

            expect(service["getPaginationParams"]()).to.deep.equal({
                limit: 25,
                skip: 50
            })
            done();
        });
        
        it("Should respect the limit of pageSize", (done)=>{
            MockApollo({
                req: {
                    query: {
                        page: 3,
                        pageSize: 150
                    }
                },
                currentRoute: {
                    queryParamKeys: ["page","pageSize"],
                    hasQueryParam: ()=>{return true}
                }
            });
            service = new Service();
            try{
                service["getPaginationParams"]();
            }
            catch(e){
                expect(e).to.deep.eq({
                    status: 400, 
                    details:"Page size can not exceed 50"
                });
            }
            done();
        });
    });

    describe("paginate()", ()=>{
        before(()=>{
            Sinon.stub(utility, "getAppUrl").returns("https://someUrl.com");
        });

        after(()=>{
            Sinon.reset();
        });
        
        it("Should return pagination object properly", (done)=>{
            MockApollo({
                req: {
                    query: {
                        page: 3,
                        pageSize: 1
                    },
                    path: "/some/path"
                },
                currentRoute: {
                    queryParamKeys: ["page","pageSize"],
                    hasQueryParam: ()=>{return true}
                }
            });
            service = new Service();
            service["getPaginationParams"]();

            let mockData = [
                {
                    firstName: "Bruce",
                    lastName: "Wayne"
                },
                {
                    firstName: "Clark",
                    lastName: "Kent"
                },
                {
                    firstName: "Tony",
                    lastName: "Stark"
                },
                {
                    firstName: "Steve",
                    lastName: "Rodgers"
                },
                {
                    firstName: "Miles",
                    lastName: "Morales"
                }
            ]
            expect(service.paginate(mockData)).to.deep.eq({
                data: mockData,
                page: {
                    current: 3,
                    next: "https://someUrl.com/some/path?page=4&pageSize=1",
                    prev: "https://someUrl.com/some/path?page=2&pageSize=1",
                    size: 1
                }
            });
            done();
        });

        it("Should return pagination object properly with sortBy", (done)=>{
            MockApollo({
                req: {
                    query: {
                        page: 3,
                        pageSize: 1,
                        sortBy: "somethingHere"
                    },
                    path: "/some/path"
                },
                currentRoute: {
                    queryParamKeys: ["page","pageSize","sortBy"],
                    hasQueryParam: ()=>{return true}
                }
            });
            service = new Service();
            service["getPaginationParams"]();
            service["getSortByParam"]();
            
            let mockData = [
                {
                    firstName: "Bruce",
                    lastName: "Wayne"
                },
                {
                    firstName: "Clark",
                    lastName: "Kent"
                },
                {
                    firstName: "Tony",
                    lastName: "Stark"
                },
                {
                    firstName: "Steve",
                    lastName: "Rodgers"
                },
                {
                    firstName: "Miles",
                    lastName: "Morales"
                }
            ]
            expect(service.paginate(mockData)).to.deep.eq({
                data: mockData,
                page: {
                    current: 3,
                    next: "https://someUrl.com/some/path?sortBy=somethingHere&page=4&pageSize=1",
                    prev: "https://someUrl.com/some/path?sortBy=somethingHere&page=2&pageSize=1",
                    size: 1
                }
            });
            done();
        });

        it("Should return pagination object properly with direction", (done)=>{
            MockApollo({
                req: {
                    query: {
                        page: 3,
                        pageSize: 1,
                        direction: "ASC",
                        sortBy: "somethingHere"
                    },
                    path: "/some/path"
                },
                currentRoute: {
                    queryParamKeys: ["page","pageSize","sortBy", "direction"],
                    hasQueryParam: ()=>{return true}
                }
            });
            service = new Service();
            service["getPaginationParams"]();
            service["getSortByParam"]();
            
            let mockData = [
                {
                    firstName: "Bruce",
                    lastName: "Wayne"
                },
                {
                    firstName: "Clark",
                    lastName: "Kent"
                },
                {
                    firstName: "Tony",
                    lastName: "Stark"
                },
                {
                    firstName: "Steve",
                    lastName: "Rodgers"
                },
                {
                    firstName: "Miles",
                    lastName: "Morales"
                }
            ]
            expect(service.paginate(mockData)).to.deep.eq({
                data: mockData,
                page: {
                    current: 3,
                    next: "https://someUrl.com/some/path?sortBy=somethingHere&direction=ASC&page=4&pageSize=1",
                    prev: "https://someUrl.com/some/path?sortBy=somethingHere&direction=ASC&page=2&pageSize=1",
                    size: 1
                }
            });
            done();
        });
    });
});