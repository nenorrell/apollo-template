import express, { Request, Response, NextFunction } from 'express';
import fs from "fs";
import path from "path";
import https from "https";
import {Routes} from './Routes/routes';
import onFinished from "on-finished"
import {yellow, green} from "chalk";
import {info, debug, error} from "../modules/logger";
import { Responses } from './Responses';
import { Rocket } from './Rocket';
import { ErrorHandler } from './ErrorHandler';
import bodyParser from 'body-parser';
import { DB } from '../modules/db/db';
import { Controller } from '../api/Controller';
import { buildApolloObj } from './Apollo';

export class App{
    public app :express.Application;
    public port :number = 1337;
    public db :DB;

    constructor(){
        info("Apollo Fueling up...");
        this.app = express();
        this.db = this.setupDb();
        this.setupBodyParsers();
        this.setupReqLogger();
        this.bindRoutes();
        this.setupErrorHandler();
    }

    private setupDb() :DB{
        const db = new DB();
        db.createPool(
            process.env.DB_HOST, 
            process.env.DB_USER,
            process.env.DB_PASSWORD,
            process.env.DB,
            process.env.DB_PORT
        );
        return db;
    }
    
    private setupReqLogger() :void{
        this.app.use((req, res, next)=>{
            info("Logging request", {req});

            onFinished(res, (err, res)=>{
                const dbState = (this.db.connection||{}).state;
                if( dbState === "connected" || dbState == "authenticated"){
                    this.db.connection.release();
                }
                info("Logging response", {res});
            });
            next();
        });
    }

    private setupBodyParsers() :void{
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({extended: true}));
    }

    private setupErrorHandler() :void{
        this.app.use((err, req, res, next) => {
            new ErrorHandler(res, err).handleError();
        });
    }

    private bindRoutes() :void{
        debug("Binding Routes...")
        new Routes().routesArray.forEach((route)=>{
            try{
                if(route.excludedEnvironments && route.excludedEnvironments.includes(process.env.ENV)){
                    info(yellow(`Excluding ${route.path} for this environment`));
                }
                else{
                    debug(`Binding ${route.path}`);
                    this.app[route.method](route.path, async (req :Request, res :Response, next :NextFunction)=>{
                        try{
                            let controller :Controller;
                            await this.db.connectPool();
    
                            if(route.customControllerPath){
                                controller = require(`../api/${route.customControllerPath}`);
                            }
                            else{
                                controller = require(`../api/${route.controller}/${route.controller}.controller.ts`);
                            }
                            let controllerClassName = Object.keys(controller)[0];
                            buildApolloObj(req, res, next, this.db, this.app, route);
                            controller = new controller[controllerClassName]();                            
                            await controller.checkPolicies()
                            controller[route.action](req, res, next);
                        }
                        catch(e){
                            next(e);
                        }
                    });
                }
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

    private setupHttpsServer() :void{
        try{
            let filePath = path.resolve(__dirname, `/ssl-config/certbot/letsencrypt/live/api.ahahockey.com`);
            let key = fs.readFileSync(`${filePath}/privkey.pem`);
            let cert = fs.readFileSync(`${filePath}/cert.pem`);
            this.rerouteHttpToHttps();  
            https.createServer({
                key,
                cert
            }, this.app)
            .listen(443);
            
            new Rocket().launch();
            info(green(`Apollo API has launched on port ${443}!`))
            
        }
        catch(err){
            error("Failed to launch https server. Falling back to the regular http server...", err);
            this.setupHttpServer();
        }
    }

    private setupHttpServer() :void{
        this.app.listen(this.port, () => {
            new Rocket().launch();
            info(green(`Apollo API has launched on port ${this.port}!`))
        });
    }

    private rerouteHttpToHttps() :void{
        this.app.use((req, res, next)=>{
            if(!req.secure){
                return res.redirect(['https://', req.get('Host'), req.url].join(''));
            }
            next();
        });
    }

    public listen(){
        if(process.env.ENV == "prod"){
            this.setupHttpsServer();
        }
        else{
            this.setupHttpServer();
        }
    }

    public getApp() :express.Application{
        return this.app;
    }
}