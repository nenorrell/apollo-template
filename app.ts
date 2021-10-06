import { green } from "chalk";
import {App} from "./src/config/App";
import { runMigrations } from "./src/modules/db-migrations/apolloMigrations";
import { debug, error } from "./src/modules/logger";

const apollo :App = new App();
runMigrations(apollo)
.then(()=>{
    debug(green("Migrations have finished!"));
    apollo.listen();
})
.catch((e)=>{
    error("Migrations Failed", e);
});