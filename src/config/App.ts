import express, { Request, Response, NextFunction } from 'express';
import {Routes} from './Routes/routes';
import onFinished from "on-finished"
import {cyan, green} from "chalk";
import {info, debug, error} from "../modules/logger";
import { Responses } from '../api/Responses';
import { Rocket } from './Rocket';
import { ErrorHandler } from '../api/ErrorHandler';
import bodyParser from 'body-parser';
// import { DB } from '../modules/db';
import { Route } from './Routes/resources/Route';

export interface Apollo{
    req :Request;
    res :Response;
    next :NextFunction;
    // db ?:PoolConnection;
    app :express.Application;
    currentRoute :Route;
}
export class App{
    public app :express.Application;
    public port :number = 1337;
    // public db :PoolConnection;

    constructor(){
        debug(cyan("Apollo Fueling up..."));
        this.app = express();
    }

    public async setupApp() :Promise<void>{
        try{
            // this.db = await this.setupDb();
            this.setupBodyParsers();
            this.setupReqLogger();
            this.bindRoutes();
            this.setupErrorHandler();
        }
        catch(e){
            throw e;
        }
    }

    // private async setupDb() :Promise<PoolConnection>{
    //     try{
    //         debug(`Connecting to DB ${process.env.DB_HOST}...`);
    //         const db = new DB();
    //         db.createPool(
    //             process.env.DB_HOST, 
    //             process.env.DB_USER,
    //             process.env.DB_PASSWORD,
    //             process.env.DB,
    //             3306
    //         );
    //         await db.connectPool();
    //         debug(`Connected!`);
    //         return db.connection;
    //     }
    //     catch(e){
    //         throw e;
    //     }
    // }
    
    private setupReqLogger() :void{
        this.app.use((req, res, next)=>{
            info("Logging request", {req});
        
            onFinished(res, (err, res)=>{
                info("Logging response", {res});
            });
            next();
        });
    }

    private setupBodyParsers() :void{
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded());
    }

    private setupErrorHandler() :void{
        this.app.use((err, req, res, next) => {
            new ErrorHandler(res, err).handleError();
        });
    }

    private bindRoutes() :void{
        info("Binding Routes...")
        new Routes().routesArray.forEach((route)=>{
            try{
                this.app[route.method](route.path, (req :Request, res :Response, next :NextFunction)=>{
                    let controller;
                    if(route.customControllerPath){
                        controller = require(`../api/${route.customControllerPath}`);
                    }
                    else{
                        controller = require(`../api/${route.controller}/${route.controller}.controller.ts`);
                    }
                    let controllerClassName = Object.keys(controller)[0];
                    let ApolloObj :Apollo = {
                        req,
                        res,
                        next,
                        // db: this.db,
                        app: this.app,
                        currentRoute: route
                    }
                    controller = new controller[controllerClassName](ApolloObj);
                    controller[route.action](req, res, next);
                });
            }
            catch(e){
                error("FAILED BINDING ROUTE: ", e);
            }
        });

        this.app.get('*', (req, res)=>{
            this.notFound(req, res,'GET')
        });
        this.app.post('*', (req, res)=>{
            this.notFound(req, res,'POST')
        });
        this.app.put('*', (req, res)=>{
            this.notFound(req, res,'PUT')
        });
        this.app.delete('*', (req, res)=>{
            this.notFound(req, res,'DELETE')
        });

        debug("Routes bound.")
    }

    private notFound(req, res, method) :void{
        new Responses(res).notFound(`${method} ${req.path} is not a valid operation`);
    }

    public listen(){
        this.app.listen(this.port, () => {
            new Rocket().launch();
            debug(green(`Apollo API has launched on port ${this.port}!`))
        })
    }

    public getApp() :express.Application{
        return this.app;
    }
}