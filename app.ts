import * as express from 'express';
import {Routes} from './src/config/Routes/routes';
import * as onFinished from "on-finished"
import {cyan, green} from "chalk";
import {info, debug, error} from "./src/modules/logger";
import { Responses } from './src/api/Responses';
import { Rocket } from './src/config/Rocket';

const app = express();
const port = 1337;

debug(cyan("Apollo Fueling up..."))

app.use((req, res, next)=>{
    info("Logging request", {req});

    onFinished(res, (err, res)=>{
        info("Logging response", {res});
    });
    next();
});

info("Binding Routes...")
new Routes().buildRoutesArray().forEach((route)=>{
    try{
        app[route.method](route.path, (req, res)=>{
            let controller = require(`./src/api/${route.controller}/${route.controller}.controller.ts`);
            let controllerClassName = Object.keys(controller)[0];
            controller = new controller[controllerClassName](req, res)
            controller[route.action](req, res);
        });
    }
    catch(e){
        error("FAILED BINDING ROUTE: ", e);
    }
});

const notFound = (req, res, method)=>{
    new Responses(res).notFound(`${method} ${req.path} is not a valid operation`);
}

app.get('*', (req, res)=>{
    notFound(req, res,'GET')
});
app.post('*', (req, res)=>{
    notFound(req, res,'POST')
});
app.put('*', (req, res)=>{
    notFound(req, res,'PUT')
});
app.delete('*', (req, res)=>{
    notFound(req, res,'DELETE')
});

debug("Routes bound.")

app.listen(port, () => {
    new Rocket().launch();
    debug(green(`Apollo API has launched on port ${port}!`))
})