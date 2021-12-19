import { ObjectOfAnything } from "@apollo-api/core/dist/resources/Common";
import { red } from "chalk";
import { ApolloConfig } from "../../config/Apollo/ApolloConfig";
import * as log from "./bunyanConfig";

const tag :string = `${process.env.ENV || "local"}.apollo-api`;

const formatLogData = (arg, str) :[ObjectOfAnything, string]=>{
    let serializerObj = {
        tag,
    };
    let logMessage = "";

    if (!arg && str && typeof str == "string") {
        logMessage = str;
    }
    else if (typeof(arg) == "string") {
        logMessage = arg || str;
    }
    else if (typeof(arg) == "object") {
        arg = {
            ...arg,
            tag,
        };
        serializerObj = arg;
        logMessage = str;
    }

    return [serializerObj, logMessage];
};

export const applyToLog = (method :keyof ApolloConfig["logger"], str, arg, ...extraArgs) :void =>{
    if (!(process.env.NODE_ENV === "test" && process.env.RUN_TESTS_WITH_LOGS == "false")) {
        const args = formatLogData(arg || arg, str);
        if (args) {
            log[method].apply(log, [...args, ...extraArgs]);
        }
        else {
            log[method].apply(log, [str, ...extraArgs]);
        }
    }
};

export const info = (str?:any, arg?:any, ...extraArgs) :void=>{
    applyToLog("info", str, arg, ...extraArgs);
};

export const error = (str?:any, arg?:any, ...extraArgs) :void=>{
    str = red(str);
    applyToLog("error", str, arg, ...extraArgs);
};

export const debug = (str?:any, arg?:any, ...extraArgs) :void=>{
    applyToLog("debug", str, arg, ...extraArgs);
};
