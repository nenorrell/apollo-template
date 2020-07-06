// import { Pool, createPool, PoolConnection } from "mysql"

// export class DB{
//     public pool :Pool;
//     public connection :PoolConnection;
    
//     createPool(host :string, username :string, password :string, database :string, port ?:number) :DB{
//         this.pool = createPool({
//             connectionLimit: 15,
//             host: host,
//             port: port || 3306,
//             user: username,
//             password: password,
//             database: database
//         });
//         return this;
//     }

//     async connectPool(){
//         try{
//             this.connection = await this.getPoolConnection();
//         }
//         catch(e){
//             throw e;
//         }
//     }

//     private getPoolConnection() :Promise<PoolConnection>{
//         return new Promise((resolve, reject)=>{
//             this.pool.getConnection((err, connection)=>{
//                 if(err){
//                     reject(err)
//                 }
//                 resolve(connection);
//             })
//         })
//     }
// }