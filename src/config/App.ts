import * as express from "express";
import { Application } from "express";
import * as fs from "fs";
import * as path from "path";
import * as https from "https";
import * as onFinished from "on-finished";
import {green} from "chalk";
import {info, debug, error} from "../modules/logger";
import { ErrorHandler } from "./ErrorHandler";
import * as cors from "cors";
import { minervaConfig, ConnectionNames } from "./MinervaConfig";
import { apolloVisualizerUI } from "@apollo-api/visualizer";
import { Responses, Rocket, Routes, } from "@apollo-api/core";
import { apolloConfig } from "./Apollo/ApolloConfig";
import { Minerva } from "@apollo-api/minerva";

export class App {
    public app :Application;
    public port :number = 1337;
    public db :Minerva<ConnectionNames> = new Minerva(minervaConfig);

    constructor() {
        info("Apollo Fueling up...");
        this.app = express();
        this.enableCors();
        this.registerDocsUi();
        this.setupBodyParsers();
        this.setupReqLogger();
        this.bindRoutes();
        this.setupErrorHandler();
    }

    private setupReqLogger() :void {
        this.app.use((req, res, next)=>{
            info("Logging request", {req});

            onFinished(res, (err, res)=>{
                info("Logging response", {res});
            });
            next();
        });
    }

    private enableCors() :void {
        this.app.use(cors());
    }

    private registerDocsUi() :void {
        debug("Setting up docs UI at /docs");
        this.app.use("/docs", (req, res, next)=>{
            apolloVisualizerUI().then(tpl=> res.send(tpl));
        });
    }

    private setupBodyParsers() :void {
        this.app.use(<any>express.json());
        this.app.use(<any>express.urlencoded({extended: true}));
    }

    private setupErrorHandler() :void {
        this.app.use((err, req, res, next) => {
            new ErrorHandler(res, err).handleError();
        });
    }

    private bindRoutes() :void {
        debug("Binding Routes...");

        new Routes(apolloConfig).bindRotues({
            app: this.app,
            routeHooks: {
                before: null,
                after: null
            },
            apolloCustom: {
                db: this.db
            },
        });

        this.app.get("*", (req, res)=>{
            this.notFound(req, res, "GET");
        });
        this.app.post("*", (req, res)=>{
            this.notFound(req, res, "POST");
        });
        this.app.put("*", (req, res)=>{
            this.notFound(req, res, "PUT");
        });
        this.app.delete("*", (req, res)=>{
            this.notFound(req, res, "DELETE");
        });

        debug("Routes bound.");
    }

    private notFound(req, res, method) :void {
        new Responses(res).notFound(`${method} ${req.path} is not a valid operation`);
    }

    private setupHttpsServer() :void {
        try{
            const filePath = path.resolve(__dirname, `/ssl-config/certbot/letsencrypt/live/${process.env.SSL_DOMAIN}`);
            const key = fs.readFileSync(`${filePath}/privkey.pem`);
            const cert = fs.readFileSync(`${filePath}/cert.pem`);
            this.rerouteHttpToHttps();
            https.createServer({
                key,
                cert
            }, this.app)
                .listen(443);

            new Rocket(apolloConfig).launch();
            info(green(`Apollo API has launched on port ${443}!`));
        }
        catch(err) {
            error("Failed to launch https server. Falling back to the regular http server...", err);
            this.setupHttpServer();
        }
    }

    private setupHttpServer() :void {
        this.app.listen(this.port, () => {
            new Rocket(apolloConfig).launch();
            info(green(`Apollo API has launched on port ${this.port}!`));
        });
    }

    private rerouteHttpToHttps() :void {
        this.app.use((req, res, next)=>{
            if(!req.secure) {
                return res.redirect(["https://", req.get("Host"), req.url].join(""));
            }
            next();
        });
    }

    public listen() {
        if(process.env.ENV == "prod") {
            this.setupHttpsServer();
        }
        else{
            this.setupHttpServer();
        }
    }

    public getApp() :Application {
        return this.app;
    }
}
