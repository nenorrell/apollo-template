import Sinon from "sinon";

import { buildApolloObj } from "../../src/config/Apollo";

type MockedApollo = {
    req ?:any,
    res ?:any,
    next ?:any,
    db ?:any,
    app ?:any,
    currentRoute ?:any
}

export const MockApollo = (mocked ?:MockedApollo) :void=>{
    buildApolloObj(
        (mocked||{}).req || <any>Sinon.mock(),
        (mocked||{}).res || <any>Sinon.mock(),
        (mocked||{}).next || <any>Sinon.mock(),
        (mocked||{}).db || <any>Sinon.mock(),
        (mocked||{}).app || <any>Sinon.mock(),
        (mocked||{}).currentRoute || <any>Sinon.mock()
    );
}