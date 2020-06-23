import {expect} from "chai";
import * as sinon from "sinon";
import * as cp from "child_process";
import { VersionService } from "../../src/api/version/version.service";

let service :VersionService;
describe('versionService', ()=> {
    beforeEach(()=>{
        service = new VersionService();
    })

    describe("getVersion()", ()=> {
        it('Should fetch version correctly', (done)=>{
            let buf = Buffer.from("7a01bfc", 'utf8');
            sinon.stub(service, "getGitHash").returns(buf);
            expect(service.getVersion()).to.equal("7a01bfc")
            done();
        });
    });
});