const chalk = require("chalk");
const log = require("../config/bunyanConfig");
const tag = `${process.env.ENV || "local"}.apollo-api`;

function addTag(arg, str) {
    if(typeof(arg) == "string") {
        return [{tag: tag}, str || arg];
    }
    else if(typeof(arg) == "object") {
        arg.tag = tag;
        return [arg, str];
    }
}

function applyToLog(method, str, arg, ...extraArgs) {
    if(!(process.env.NODE_ENV === "test" && process.env.RUN_TESTS_WITH_LOGS == "false")) {
        const args = addTag(arg || arg, str);
        if(args) {
            log[method].apply(log, [...args, ...extraArgs]);
        }
        else{
            log[method].apply(log, [str, ...extraArgs]);
        }
    }
}

export const info = (str?:any, arg?:any, ...extraArgs)=>{
    applyToLog("info", str, arg, ...extraArgs);
};

export const error = (str?:any, arg?:any, ...extraArgs)=>{
    str = chalk.red(str);
    applyToLog("error", str, arg, ...extraArgs);
};

export const debug = (str?:any, arg?:any, ...extraArgs)=>{
    applyToLog("debug", str, arg, ...extraArgs);
};
