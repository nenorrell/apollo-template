import { ApolloType, formatError } from "@apollo-api/core";
export interface Policies{
    isAuthenticated: (Apollo :ApolloType) => Promise<void>
}

export type PolicyNames = keyof Policies;

export const PolicyMethods :Policies = {
    isAuthenticated: async (Apollo :ApolloType) :Promise<void> =>{
        const token = Apollo.req.get("Authorization");
        if(token) {
            // let blackListed = await isTokenBlackListed(token, Apollo.tokenStore);

            // if(blackListed && validateToken(token)){
            //     throw formatError(400, "Invalid Token");
            // }
        }
        else{
            throw formatError(401, "You're not authorized to make this request");
        }
    }
};
