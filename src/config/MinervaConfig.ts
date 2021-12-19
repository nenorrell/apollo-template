import { MinervaConfig } from "@apollo-api/minerva";
import * as logger from "../modules/logger/logger";

export type ConnectionNames = "token-store";

export const minervaConfig :MinervaConfig<ConnectionNames> = {
    connections: [
        {
            name: "token-store",
            host: process.env.DB_TOKEN_STORE_HOST,
            port: parseInt(process.env.DB_TOKEN_STORE_PORT) || 3306,
            user: process.env.DB_TOKEN_STORE_USER,
            password: process.env.DB_TOKEN_STORE_PASS,
            database: process.env.DB_TOKEN_STORE,
            pool: {
                min: 0,
                max: 15
            }
        }
    ],
    camelizeKeys: true,
    disableLogs: true,
    logger: {
        ...logger,
        warn: ()=>{}
    }
};
