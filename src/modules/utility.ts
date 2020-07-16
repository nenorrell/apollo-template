import { ErrorInterface } from "../config/resources/ErrorInterface";
import {camelCase, mapKeys, snakeCase} from "lodash";
export const cleanObject = (obj :any) :void =>{
    Object.keys(obj).forEach((key) => (obj[key] == null) && delete obj[key]);
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
    for(let index :number = 0; index < array.length; index++) {
       await callback(array[index], index, array);
    }
}