import { Pool, createPool, PoolConnection, escape } from "mysql"
import { debug } from "../logger";
import { ColumnArray, Field, QueryOptions } from "./db.types";
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

    private async buildUpdateValues(insertObject :any) :Promise<string>{
        let updateValues = ``;

        await asyncForEach(Object.keys(insertObject), (column :string, index :number, columns :Array<any>) =>{
            let value = this.handleInsertValue(insertObject[column]);
            column = camelCaseToUnderscore(column);
            if(columns.length-1 === index){
                updateValues += `${column}=${value}`;
            }
            else{
                updateValues += `${column}=${value}, `;
            }
        });
        return `${updateValues}`;
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

    private async buildFetch(table :string, fields :ColumnArray | string, where :Array<Field>, options ?:QueryOptions) :Promise<string>{
        let selectFields = await this.buildFields(fields);
        let whereFields = await this.buildWhere(where);
        let sql = `SELECT ${selectFields} FROM ${table} ${whereFields}`;
        if(options){
            if(options.orderBy){
                sql += ` ORDER BY ${camelCaseToUnderscore(options.orderBy)}`;
            }
            if(options.direction){
                switch(options.direction.toUpperCase()){
                    case "ASC":
                        sql += ` ASC`;
                    break;
                    case "DESC":
                        sql += ` DESC`;
                    break;
                }
            }
            if(options.limit){
                sql += ` LIMIT ${escape(options.limit)}`;
            }
            if(options.skip){
                sql += ` OFFSET ${escape(options.skip)}`;
            }
        }
        return sql;
    }

    private async buildWhere(fields :Array<Field>) :Promise<string>{
        let sql = "WHERE ";

        await asyncForEach(fields, (field :Field, index :number, fields :Array<any>)=>{
            field.name = camelCaseToUnderscore(field.name);
            if(fields.length > 1 && field.operator){
                sql += ` ${field.operator} `;
            }
            
            sql += `${field.name}=${escape(field.value)}`;
        })
        return sql;
    }

    private async buildDelete(table :string, where :Array<Field>) :Promise<string>{
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

    public async find(table :string, fields :string|ColumnArray, where :Array<Field>, options ?:QueryOptions) :Promise<Array<any>>{
        try{
            table = camelCaseToUnderscore(table);
            let sql = await this.buildFetch(table, fields, where, options);
            return await this.query(sql);
        }
        catch(e){
            throw e;
        }
    }

    public async findOne(table :string, fields :string|ColumnArray, where :Array<Field>, options ?:QueryOptions) :Promise<any>{
        try{
            let result = await this.find(table, fields, where, options);
            return result.length != 0 ? result[0] : null;
        }
        catch(e){
            throw e;
        }
    }

    public async update(table :string, updateObject :any, where :Array<Field>, options ?:QueryOptions) :Promise<any>{
        try{
            table = camelCaseToUnderscore(table);
            let updateValues = await this.buildUpdateValues(updateObject);
            let whereFields = await this.buildWhere(where);
            let sql = `UPDATE ${table} SET ${updateValues} WHERE ${whereFields}`;
            return await this.query(sql, true);
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

    public async delete(table :string, where :Array<Field>) :Promise<any>{
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