import {expect} from "chai";
import * as utility from "../../src/modules/utility";

describe("Utility", ()=>{
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