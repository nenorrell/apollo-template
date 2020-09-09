import {Controller} from "../Controller";
import fs from "fs/promises";
import path from "path";

export class RootController extends Controller{
    constructor(){
        super();
    }

    public index() :any{
        return this.responses.responseObject(200, "Healthy")
    }

    public async certbot() :Promise<any>{
        try{
            let filePath = `/ssl-config/certbot/www/.well-known/acme-challenge/${this.req.params["challengeString"]}`;
            let challenge = await fs.readFile(path.resolve(__dirname, `${filePath}`), "utf-8");
            return this.responses.responseText(200, challenge);
        }
        catch(e){
            this.next(e)
        }
    }
}