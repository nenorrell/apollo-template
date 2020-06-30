import { NextFunction, Response, Request } from "express";
import { error } from "../../modules/logger";
import { formatError } from "../../modules/utility";

interface PolicyFunction{
    (req :Request, res :Response, next :NextFunction) :boolean;
}

export class Policies{
    private res :Response;
    private req :Request;
    public next :NextFunction;
    private list :Map<String, PolicyFunction> = new Map();

    constructor(req :Request, res :Response, next :NextFunction){
        try{
            this.req = req;
            this.res = res;
            this.next = next;
            this.setPolicies();
        }
        catch(e){
            error("Failed setting up policies: ", e);
        }
    }

    public runPolicy(policyName :string) :boolean{
        const policy = this.list.get(policyName);
        return policy(this.req, this.res, this.next);
    }

    private setPolicies() :void{
        // An Example of how you would set your policy:
        // 
        // this.list.set("isAuthenticated", this.isAuthenticated);
    }

    // An example of what a policy might look like:
    // 
    // private isAuthenticated(req :Request, res :Response, next :NextFunction) :boolean{
    //     if(req.get("Authorization")) {
    //         return true;
    //     }
    //     else{
    //         throw formatError(401, "You're not authorized to make this request")
    //     }
    // }
}