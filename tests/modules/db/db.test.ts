import {expect} from "chai";
import { DB } from "../../../src/modules/db/db";
let db :DB;

describe('DB', ()=> {
    beforeEach(()=>{        
        db = new DB();
        db.connection = <any>{
            escape: (valueIn)=>{
                return valueIn;
            }
        }
    })

    describe("buildFields()", ()=> {
        it('Should build columns properly', async ()=>{
            let fields = await db['buildFields'](['id', 'firstName', 'lastName']);
            expect(fields).to.eq('id, first_name, last_name');
        });
    });

    describe("buildInsertValues()", ()=> {
        it('Should build insert columns and values properly', async ()=>{
            let insertObj = {
                firstName: "Testing",
                lastName: "User",
                password: "60adb9e9e9e4081edc12d9994943074553e0bdc3",
                email: "test@email.com",
                salt: "UQR66ptmAh67T8G"
            };
            let insertValues = await db['buildInsertValues'](insertObj)
            expect(insertValues).to.eq(
                `(first_name, last_name, password, email, salt) VALUES ("${
                    insertObj.firstName
                }", "${
                    insertObj.lastName
                }", "${
                    insertObj.password
                }", "${
                    insertObj.email
                }", "${
                    insertObj.salt
                }")`
            );
        });

        it('Should build insert columns and values properly with a single value', async ()=>{
            let insertObj = {
                someVal: 1
            };
            let insertValues = await db['buildInsertValues'](insertObj)
            expect(insertValues).to.eq(
                `(some_val) VALUES (${insertObj.someVal})`
            );
        });
    });

    describe("buildFetch()", ()=>{
        it("Should build select properly", async ()=>{
            let sql = await db['buildFetch']("some_table", ['someField', 'someOtherField'], [{
                name: "someField",
                value: "someValue"
            }])
            expect(sql).to.be.a("string");
            expect(sql).to.eq("SELECT some_field, some_other_field FROM some_table WHERE some_field='someValue'");
        });
        
        it("Should omit operator when there's only one where value", async ()=>{
            let sql = await db['buildFetch']("some_table", ['someField', 'someOtherField'], [{
                name: "someField",
                value: "someValue",
                operator: "AND"
            }]);
            expect(sql).to.be.a("string");
            expect(sql).to.eq("SELECT some_field, some_other_field FROM some_table WHERE some_field='someValue'");
        });
        
        it("Should omit operator when there's only one where value", async ()=>{
            let sql = await db['buildFetch']("some_table", ['someField', 'someOtherField'], [
                {
                    name: "someField",
                    value: "someValue"
                },
                {
                    name: "someField",
                    value: "someOtherValue",
                    operator: "AND"
                }
            ]);
            expect(sql).to.be.a("string");
            expect(sql).to.eq("SELECT some_field, some_other_field FROM some_table WHERE some_field='someValue' AND some_field='someOtherValue'");
        });
    })

    describe("handleInsertValue()", ()=> {
        it('Should return number when given a number', async ()=>{
            expect(db['handleInsertValue'](1)).to.be.a("number");
            expect(db['handleInsertValue'](1)).to.eq(1);
        });
        
        it('Should return bool when given a boolean', async ()=>{
            expect(db['handleInsertValue'](true)).to.be.a("boolean");
            expect(db['handleInsertValue'](true)).to.eq(true);
        });
        
        it('Should put string in double quotes', async ()=>{
            expect(db['handleInsertValue']("string-in")).to.be.a("string");
            expect(db['handleInsertValue']("string-in")).to.eq('"string-in"');
        });
    });

    describe("buildWhere()", ()=>{
        it("Should build where clauses with operators", async ()=>{
            let whereClause = await db["buildWhere"]([
                {
                    name: "someColumn",
                    value: "someValue"
                },
                {
                    name: "someColumn",
                    value: "someOtherValue",
                    operator: "AND"
                },
                {
                    name: "id",
                    value: 1,
                    operator: "AND"
                },
                {
                    name: "id",
                    value: 3,
                    operator: "OR"
                }
            ]);
            expect(whereClause).to.eq("WHERE some_column='someValue' AND some_column='someOtherValue' AND id=1 OR id=3")
        });
        
        it("Should omit operator from where clause when there's only one item", async ()=>{
            let whereClause = await db["buildWhere"]([
                {
                    name: "someColumn",
                    value: "someValue",
                    operator: "AND"
                }
            ])

            expect(whereClause).to.eq("WHERE some_column='someValue'")
        })
    })
});