import { ErrorInterface } from "../config/resources/ErrorInterface";

export const cleanObject = (obj :any) :void =>{
    Object.keys(obj).forEach((key) => (obj[key] == null) && delete obj[key]);
}

export const formatError = (status :number, details :any) :ErrorInterface => {
    return {
        status,
        details
    }
}