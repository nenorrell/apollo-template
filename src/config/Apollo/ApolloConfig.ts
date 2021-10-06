import { ApolloConfig } from "@apollo-api/core";
import { RouteDefinitions } from "./RouteDefinitions";
import { Policies, PolicyMethods } from "./Routes/Policies";

export const apolloConfig :ApolloConfig<Policies> = {
    routes: RouteDefinitions,
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
    pagination: {
        pageSize: 25,
        max: 50
    }
}