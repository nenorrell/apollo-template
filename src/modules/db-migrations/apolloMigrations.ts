import { yellow } from "chalk";
import * as Umzug from "umzug";
import { App } from "../../config/App";
import { debug, info } from "../logger";
import { ApolloMigrationStorage } from "./apolloMigrationStorage";

export const runMigrations = async (apollo :App, omitResolver ?:boolean) :Promise<void> =>{
    try{
        const customResolver = (migrationFile :string)=>{
            const file = migrationFile.match(/([^\/]*)\/*$/)[1];
            info(`Running migration: ${file}`);
            return require(`../../../migrations/${file}`);
        };

        debug("Running migrations...");
        const migration = new Umzug({
            migrations: {
                path: "./migrations",
                pattern: /.*/,
                customResolver: omitResolver ? null : customResolver,
                params: [
                    apollo.db.connections
                ]
            },
            storage: new ApolloMigrationStorage(apollo.db.connections)
        });

        const pending = await migration.pending();
        if(pending.length != 0) {
            info("Migrations found!");
            await migration.up();

            const executed = await migration.executed();
            executed.forEach((item)=>{
                info(`Ran migration: ${item.file}`);
            });
        }
        else{
            info(yellow("No pending migrations were found. Skipping."));
        }
    }
    catch(e) {
        throw e;
    }
};
