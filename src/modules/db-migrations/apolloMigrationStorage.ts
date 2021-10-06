import { Storage } from "umzug";
import { ConnectionNames } from "../../config/MinervaConfig";
import { ApolloType } from "../../config/Apollo/ApolloWrapper";
import { asyncForEach } from "../utility";

export class ApolloMigrationStorage implements Storage{
    constructor(public connections :ApolloType["db"]["connections"]){}

    public async createMetaTableIfNeeded(dbName :string, connection :any) :Promise<void>{        
        try{
            await connection.schema.createTableIfNotExists("migrations", (table)=>{
                table.increments();
                table.string("name", 255).notNullable();
                table.engine("InnoDB");
                table.charset("utf8");
            });
        }
        catch(e){
            throw e;
        }
    }
    
    public async logMigration(migrationName: string) :Promise<void>{
        const [targetDb, migration] = migrationName.split("_")
        const connection = this.connections.get(targetDb as any);
        await this.createMetaTableIfNeeded(targetDb, connection);
        await connection.insert({name: migrationName}).into("migrations")
    }

    public async unlogMigration(migrationName: string) :Promise<void>{
        const [targetDb, migration] = migrationName.split("_")
        const connection = this.connections.get(targetDb as any);
        await this.createMetaTableIfNeeded(targetDb, connection);

        await connection.delete()
        .from("migrations")
        .where("name", "=", migrationName);
    }

    public async executed() :Promise<String[]>{
        const connectionNames :ConnectionNames[] = [];
        this.connections.forEach((connection, key)=>{
            connectionNames.push(key);
        });
        
        const ranMigrationsArray = await asyncForEach(connectionNames, async (name)=>{
            const connection = this.connections.get(name); 
            await this.createMetaTableIfNeeded(name, connection);
            return await connection.select("*").from("migrations");
        });

        const ranMigrations :string[] = [];
        ranMigrationsArray.forEach((resultSet)=>{
            resultSet.map((result)=>{
                ranMigrations.push(result.name);
            })
        });
        return ranMigrations;
    }
}
