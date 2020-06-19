const chalk = require('chalk');
const log = require('../config/bunyanConfig');
var tag = `${process.env.ENV || 'local'}.apollo-api`;

function addTag(arg, str) {
    if(typeof(arg) == 'string'){
        return [{tag:tag}, str || arg];
    }
    else if(typeof(arg) == 'object') {
        arg.tag = tag;
        return [arg, str];
    }
}

export const info = (str, arg, ...extraArgs)=>{
    let args = addTag(arg || arg, str);
    if(args){
        log.info.apply(log, [...args, ...extraArgs]);
    }
    else{
        log.info.apply(log, [str, ...extraArgs]);
    }
}

export const error = (str, arg, ...extraArgs)=>{
    str = chalk.red(str);
    let args = addTag(arg || arg, str);
    if(args){
        log.error.apply(log, [...args, ...extraArgs]);
    }
    else{
        log.error.apply(log, [str, ...extraArgs]);
    }
}

export const debug = (str, arg, ...extraArgs)=>{
    let args = addTag(arg || arg, str);
    if(args){
        log.debug.apply(log, [...args, ...extraArgs]);
    }
    else{
        log.debug.apply(log, [str, ...extraArgs]);
    }}