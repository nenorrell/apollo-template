import { formatError } from "@apollo-api/core";
import { Apollo } from "../ApolloWrapper";

export interface Policies{
    isAuthenticated: ()=>{}
}

export const PolicyMethods :Policies = {
    isAuthenticated: async () :Promise<void> =>{
        let token = Apollo.req.get("Authorization");
        if(token){
            // let blackListed = await isTokenBlackListed(token, Apollo.tokenStore);
    
            // if(blackListed && validateToken(token)){
            //     throw formatError(400, "Invalid Token");
            // }
        }
        else{
            throw formatError(401, "You're not authorized to make this request")
        }
    }
}