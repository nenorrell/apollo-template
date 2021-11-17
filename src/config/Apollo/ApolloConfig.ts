import { Apollo, ApolloConfig } from "@apollo-api/core";
import * as path from "path";
import * as logger from "../../modules/logger";
import { RouteDefinitions } from "./RouteDefinitions";
import { Policies, PolicyMethods } from "./Routes/Policies";
import { Minerva } from "@apollo-api/minerva";
import { ConnectionNames } from "../MinervaConfig";

export type ApolloCustom = {
    db :Minerva<ConnectionNames>
}
export type ApolloType = Apollo<ApolloCustom>;

export const apolloConfig :ApolloConfig<ApolloCustom, Policies> = {
    routes: RouteDefinitions,
    controllerDirectory: path.resolve(__dirname, "../../api"),
    policies: PolicyMethods,
    environments: {
        local: {
            url: "http://localhost:3035"
        },
        qa: {
            url: "https://qa.somewhere.com"
        },
        prod: {
            url: "https://somewhere.com"
        }
    },
    logger,
    pagination: {
        pageSize: 25,
        max: 50
    }
};
