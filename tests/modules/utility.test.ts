import {expect} from "chai";
import Sinon from "sinon";
import * as utility from "../../src/modules/utility";

describe("Utility", ()=>{
    describe("formatError()", ()=>{
        it("Should format error properly", (done)=>{
            let error = utility.formatError(400, "Some Error");
            expect(error).to.deep.eq({
                status: 400,
                details: "Some Error"
            });
            done();
        });
    });

    describe("camelCaseToUnderscore()", ()=>{
        it("Should convert camelCase to underscore separated string", (done)=>{
            let underscoreString = utility.camelCaseToUnderscore("camelCase");
            expect(underscoreString).to.eq("camel_case");
            done();
        });

        it("Shouldn't alter underscores in string", (done)=>{
            let underscoreString = utility.camelCaseToUnderscore("camel_case");
            expect(underscoreString).to.eq("camel_case");
            done();
        });

        it("Should handle camel case with underscores", (done)=>{
            let underscoreString = utility.camelCaseToUnderscore("camel_caseString");
            expect(underscoreString).to.eq("camel_case_string");
            done();
        });
    });

    describe("objKeysToCamelCase()", ()=>{
        it("Should convert object keys to camelCase from underscore separated string", (done)=>{
            let convertedObj = utility.objKeysToCamelCase({
                some_key: "someValue",
                some_other_key: "some_other_value"
            });
            expect(convertedObj).to.deep.eq({
                someKey: "someValue",
                someOtherKey: "some_other_value"
            });
            done();
        });
    });

    describe("asyncForEach()", ()=>{
        it("Should loop through as expected", async ()=>{
            let counter :number = 0;
            let items = [1, 2, 3, 4, 5];
            await utility.asyncForEach(items, (item, index, array)=>{
                counter = index+1;
            });
            expect(counter).to.eq(5);
        });
    });
});