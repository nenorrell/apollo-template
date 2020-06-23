import request from "supertest";
import {expect} from "chai";
import * as sinon from "sinon";
import {app} from "../testApp";
const App = app.getApp();

describe('Version', ()=> {
    describe("GET /version", async ()=> {
        it('Should return version as expected', async ()=>{
            await request(App)
            .get("/version")
            .expect(200)
        });
    });
});