import { formatError } from "../../modules/utility";
import { validateToken, readToken } from "../../modules/Auth/Auth";
import { Apollo } from "../Apollo";

export enum PolicyOptions{
}

export const readPolicy = (policy :PolicyOptions) :string=>{
    return PolicyOptions[policy];
}

export class Policies{
    private list :Map<String, Function> = new Map();
    
    constructor(){
        try{
            this.setPolicies();
        }
        catch(e){
            throw e;
        }
    }

    public async runPolicy(policyName :string) :Promise<void>{
        const policy = this.list.get(policyName);
        await policy();
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