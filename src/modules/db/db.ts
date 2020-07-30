import { Pool, createPool, PoolConnection, escape } from "mysql"
import { debug } from "../logger";
import { ColumnArray, FieldType, QueryOptions, ColumnValueObject } from "./dbTypes";
import { camelCaseToUnderscore, objKeysToCamelCase, asyncForEach } from "../utility";

export class DB{
    public pool :Pool;
    public connection :PoolConnection;
    
    public createPool(host :string, username :string, password :string, database :string, port ?:any) :DB{
        debug(`Connecting to DB ${host}:${port||3306}...`);
        this.pool = createPool({
            connectionLimit: 15,
            host: host,
            port: port || 3306,
            user: username,
            password: password,
            database: database
        });
        return this;
    }

    public async connectPool(){
        try{
            this.connection = await this.getPoolConnection();
        }
        catch(e){
            throw e;
        }
    }

    private getPoolConnection() :Promise<PoolConnection>{
        return new Promise((resolve, reject)=>{
            this.pool.getConnection((err, connection)=>{
                if(err){
                    reject(err)
                }
                resolve(connection);
            })
        })
    }
    
    private async buildFields(fields :ColumnArray | string) :Promise<string>{
        let columns = "*";
        if(fields !== "*"){
            if(fields && Array.isArray(fields) && fields.length !== 0){
                columns = "";
                await asyncForEach(fields, async (field, i, fields) => {
                    field = camelCaseToUnderscore(field);
                    if(fields.length-1 == i){
                        columns += `${field}`;
                    }
                    else{
                        columns += `${field}, `;
                    }
                });
            }
        }
        return columns;
    }

    private handleInsertValue(valueIn :any) :any{
        switch(typeof valueIn){
            case "number":
                return valueIn;
            case "boolean":
                return valueIn;
            case "string":
                return `"${valueIn}"`;
            default:
                return valueIn;
        }
    }

    private async buildInsertValues(insertObject :any) :Promise<string>{
        let cols :string = "";
        let vals :string = "";

        await asyncForEach(Object.keys(insertObject), (column :string, index :number, columns :Array<any>) =>{
            let value = this.handleInsertValue(insertObject[column]);
            column = camelCaseToUnderscore(column);
            if(columns.length-1 === index){
                cols += `${column}`;
                vals += `${value}`;
            }
            else{
                cols += `${column}, `;
                vals += `${value}, `;
            }
        });
        return `(${cols}) VALUES (${vals})`;
    }

    private async buildFetch(table :string, fields :ColumnArray | string, where :Array<FieldType>, options ?:QueryOptions) :Promise<string>{
        let selectFields = await this.buildFields(fields);
        let whereFields = await this.buildWhere(where);
        let sql = `SELECT ${selectFields} FROM ${table} ${whereFields}`;
        if(options){
            if(options.limit){
                sql += `LIMIT ${options.limit}`;
            }
            if(options.offset){
                sql += `OFFSET ${options.offset}`;
            }
        }
        return sql;
    }

    private async buildWhere(fields :Array<FieldType>) :Promise<string>{
        let sql = "WHERE ";

        await asyncForEach(fields, (field :FieldType, index :number, fields :Array<any>)=>{
            field.name = camelCaseToUnderscore(field.name);
            if(fields.length > 1 && field.operator){
                sql += ` ${field.operator} `;
            }
            
            sql += `${field.name}=${escape(field.value)}`;
        })
        return sql;
    }

    private async buildDelete(table :string, where :Array<FieldType>) :Promise<string>{
        let whereFields = await this.buildWhere(where);
        return `DELETE FROM ${table} ${whereFields}`;
    }

    public async query(query :string, ignoreFormatting ?:boolean) :Promise<any>{
        return new Promise((resolve, reject)=>{
            this.connection.query(query, (err, results)=>{
                if(err){
                    reject(err)
                }
                else{
                    if(!ignoreFormatting){
                        results = results.map((result)=> objKeysToCamelCase(result));
                    }
                    resolve(results);
                }
            })
        });
    }

    public async find(table :string, fields :string|ColumnArray, where :Array<FieldType>, options ?:QueryOptions) :Promise<any>{
        try{
            table = camelCaseToUnderscore(table);
            let sql = await this.buildFetch(table, fields, where, options);
            return await this.query(sql);
        }
        catch(e){
            throw e;
        }
    }

    public async findOne(table :string, fields :string|ColumnArray, where :Array<FieldType>, options ?:QueryOptions) :Promise<any>{
        try{
            table = camelCaseToUnderscore(table);
            let sql = await this.buildFetch(table, fields, where, options);
            let result = await this.query(sql);
            return result.length != 0 ? result[0] : null;
        }
        catch(e){
            throw e;
        }
    }

    public async insert(table :string, insertObject :any, insertOnly ?:boolean) :Promise<any>{       
        try{
            table = camelCaseToUnderscore(table);
            let insertValues = await this.buildInsertValues(insertObject);
            let sql = `INSERT INTO ${table} ${insertValues}`;
            let result = await this.query(sql, true);

            if(insertOnly){
                return result;
            }
            else{
                return await this.findOne(table, "*", [{
                    name: "id",
                    value: result.insertId
                }]);
            }
        }
        catch(e){
            throw e;
        }
    }

    public async delete(table :string, where :Array<FieldType>) :Promise<any>{
        try{
            table = camelCaseToUnderscore(table);
            let sql = await this.buildDelete(table, where);
            let result = await this.query(sql, true);
            return result.length != 0 ? result[0] : null;
        }
        catch(e){
            throw e;
        }
    }
}