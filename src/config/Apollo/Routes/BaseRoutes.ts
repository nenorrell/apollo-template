import { Route, RouteParam } from "@apollo-api/core";
import { PolicyNames } from "./Policies";

const root :Route = new Route()
    .setMethod("GET")
    .setPath("/")
    .setController("root")
    .setAction("index")
    .setDescription("Check to see if the API is running");

const pause :Route = new Route()
    .setMethod("GET")
    .setPath("/pause")
    .setPolicies<PolicyNames>(["isAuthenticated"])
    .setController("root")
    .setAction("pause")
    .setDescription("Check to see if the API is running");

const version :Route = new Route()
    .setMethod("GET")
    .setPath("/version")
    .setController("version")
    .setAction("getVersion")
    .setDescription("This endpoint will display the version of the API being used");

const certChallenge :Route = new Route()
    .setMethod("GET")
    .setPath("/.well-known/acme-challenge/:challengeString")
    .setPathParams([
        new RouteParam()
            .setName("challengeString")
            .setType("string")
            .setRequired(true)
    ])
    .setController("root")
    .setAction("certbot")
    .setExcludedEnvironments(["local", "qa"])
    .setDescription("This endpoint is only for certbot to authenticate against")
    .setHideFromDocs(true);

const apiDocs :Route = new Route()
    .setMethod("GET")
    .setPath("/api/docs")
    .setDescription("This endpoint will display currently configured routes")
    .setController("api-docs")
    .setAction("displayRoutes")
    .setHideFromDocs(true);

export const baseRoutes :Array<Route> = [
    root,
    pause,
    version,
    apiDocs,
    certChallenge
];
