"use strict";
const fetch = require("node-fetch");
const chalk = require("chalk");

module.exports = {
    makeRequest: async (path, opts)=>{
        try{
            let options = Object.assign({
                method: 'GET',
                data: {}
            }, opts);
            return (await fetch(path, options)).json();
        }
        catch(e){
            throw e;
        }
    }
}