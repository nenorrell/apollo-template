import { App } from "../src/config/App";
import { error } from "../src/modules/logger";

export default {
    up: async function(connections :App["db"]["connections"]) :Promise<boolean> {
        try{
            const connection = connections.get("token-store");
            await connection.schema.createTable("archived_tokens", (table)=>{
                table.increments();
                table.integer("user_id", 11).notNullable();
                table.string("token", 255).notNullable();
                table.integer("expires", 11).defaultTo(0);
                table.dateTime("created_at").defaultTo(connection.fn.now());
                table.dateTime("updated_at").defaultTo(connection.fn.now());
                table.engine("InnoDB");
                table.charset("utf8mb4");
            });
            return true;
        }
        catch(e) {
            error(e);
            return false;
        }
    },

    down: async function(connections :App["db"]["connections"]) :Promise<boolean> {
        try{
            const connection = connections.get("token-store");
            await connection.schema.dropTable("archived_tokens");
        }
        catch(e) {
            error(e);
            return false;
        }
    }

};
