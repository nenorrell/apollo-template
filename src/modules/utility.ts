import { ErrorInterface } from "../config/resources/ErrorInterface";
import {camelCase, mapKeys, snakeCase} from "lodash";
export const cleanObject = (obj :any) :void =>{
    Object.keys(obj).forEach((key) => (obj[key] == null) && delete obj[key]);
}

export const getEnumValue = (enumType :any, value:any)=>{
    return enumType[value];
}

export const formatError = (status :number, details :any) :ErrorInterface => {
    return {
        status,
        details
    }
}

export const camelCaseToUnderscore = (str :string) :string => {
    return snakeCase(str);
}

export const objKeysToCamelCase = (obj)=>{
    return mapKeys(obj, (v, k) => camelCase(k))
}

export const asyncForEach = async (array :Array<any>, callback :Function) :Promise<any> =>{
    try{
        for(let index :number = 0; index < array.length; index++) {
            await callback(array[index], index, array);
         }
    }
    catch(e){
        throw e;
    }
}

export const asyncForEachParallel = async (array :Array<any>, callback :Function) :Promise<any> =>{
    try{
        const allPromises = array.map((item, index, array) => callback(item, index, array));
        return await Promise.all(allPromises);
    }
    catch(e){
        throw e;
    }
}

export const removeArrayItem = (arr :Array<any>, index :number)=>{
    delete arr[index];
    return arr.filter((item) => item != undefined);
}

export const getAppUrl = () :string =>{
    switch(process.env.ENV){
        case 'local':
            return 'http://localhost:3035';
        case 'qa':
            return 'http://qa.hockeydev.com:1337';
        case 'prod':
            return 'https://api.ahahockey.com';
        default:
            return 'http://localhost:3035';
    }
}

export const parseBoolString = (value :string | boolean) :boolean => {
    if (typeof value === 'string')
      return value.toLowerCase() === 'true';
    return value;
  }