import { NextFunction, Response, Request } from "express";
import { error } from "../../modules/logger";
import { formatError } from "../../modules/utility";

interface PolicyFunction{
    (req :Request, res :Response, next :NextFunction) :boolean;
}

export enum PolicyOptions{
}

export const readPolicy = (policy :PolicyOptions) :string=>{
    return PolicyOptions[policy];
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
            throw e;
        }
    }

    public runPolicy(policyName :string) :boolean{
        const policy = this.list.get(policyName);
        return policy(this.req, this.res, this.next);
    }

    private setPolicies() :void{        
        for(let policy in PolicyOptions){
            if(isNaN(Number(policy))){
                if(typeof this[policy] !== "function"){
                    throw `Error setting up policies: ${policy} is not a valid policyfunction`;
                }
                this.list.set(policy, this[policy])
            }
        }
    }
}