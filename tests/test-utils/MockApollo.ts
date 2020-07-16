import Sinon from "sinon";
import { Apollo } from "../../src/config/App";
import { Request } from "express";

export const MockApollo :Apollo = {
    req: <any>Sinon.mock(),
    res:  <any>Sinon.mock(),
    next: <any>Sinon.mock(),
    app: <any>Sinon.mock(),
    db: <any>Sinon.mock(),
    currentRoute: <any>Sinon.mock(),
}