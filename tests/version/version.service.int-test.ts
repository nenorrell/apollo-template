import * as request from "supertest";
import {expect} from "chai";
import {app} from "../testApp";

describe('Version', ()=> {
    describe("GET /version", async ()=> {
        it('Should return version as expected', async ()=>{
            await request(app.getApp())
            .get("/version")
            .expect(200)
            .expect(res => {
                expect(res.body).to.be.an('object');
                expect(res.body.response).to.be.an('object');
                expect(res.body.response.version).to.be.a('string');
            })
        });
    });
});
