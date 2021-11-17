import { Controller } from "@apollo-api/core";
import fs from "fs/promises";
import path from "path";
import { ApolloType } from "../../config/Apollo/ApolloConfig";

export class RootController extends Controller {
    constructor(Apollo :ApolloType) {
        super(Apollo);
    }

    public index() :any {
        console.log("***** ROUTE *****");
        console.log(this.currentRoute);
        return this.responses.responseText(200, "Healthy");
    }

    public async certbot() :Promise<any> {
        try{
            const filePath = `/ssl-config/certbot/www/.well-known/acme-challenge/${this.req.params["challengeString"]}`;
            const challenge = await fs.readFile(path.resolve(__dirname, `${filePath}`), "utf-8");
            return this.responses.responseText(200, challenge);
        }
        catch(e) {
            this.next(e);
        }
    }
}
