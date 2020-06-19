'use strict';

const chai = require('chai'),
expect = chai.expect,
sinon = require('sinon'),
cp = require('child_process'),
versionService = require('../../../src/api/services/version.service');

describe('versionService', ()=> {
    describe("getVersion()", ()=> {
        it('Should fetch version correctly', (done)=>{
            let buf = Buffer.from("7a01bfc", 'utf8');
            sinon.stub(cp, "execSync").returns(buf)
            
            expect(versionService.getVersion()).to.equal("7a01bfc")
            done();
        });
    });
});