const mysql = require('mysql2');
const pool = mysql.createPool({
    host: process.env.DB_SERVER,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    database: process.env.DB,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports.query = async (query, values)=>{
    try{
        if(values){
            return await pool.promise().execute(
                query,
                values
            );
        }
        else{
            return pool.promise().query(query)
        }
    }
    catch(e){
        throw e;
    }
}

module.exports.queryOne = async (query, values)=>{
   try{
        let result = await this.query(query, values);
        return result[0][0];
   }
   catch(e){
        throw e
   }
}