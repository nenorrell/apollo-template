import { NextFunction, Response, Request } from "express";
import { Apollo } from "../App";
import { DB } from "../../modules/db/db";

interface PolicyFunction{
    (req :Request, res :Response, next :NextFunction, db ?:DB) :boolean;
}

export enum PolicyOptions{
}

export const readPolicy = (policy :PolicyOptions) :string=>{
    return PolicyOptions[policy];
}

export class Policies{
    private db :DB;
    private res :Response;
    private req :Request;
    public next :NextFunction;
    private list :Map<String, PolicyFunction> = new Map();

    constructor(Apollo :Apollo){
        try{
            this.req = Apollo.req;
            this.res = Apollo.res;
            this.next = Apollo.next;
            this.db = Apollo.db;
            this.setPolicies();
        }
        catch(e){
            throw e;
        }
    }

    public async runPolicy(policyName :string) :Promise<void>{
        const policy = this.list.get(policyName);
        await policy(this.req, this.res, this.next, this.db);
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