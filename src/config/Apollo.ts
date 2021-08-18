import express, { NextFunction, Response, Request } from "express";
import { Route } from "./Routes/resources/Route";

export type ApolloType = {
    req :Request;
    res :Response;
    next :NextFunction;
    app :express.Application;
    currentRoute :Route;
}

export const buildApolloObj = (req :Request, res :Response, next :NextFunction, app:express.Application, currentRoute :Route) :void => {
    Apollo = {
        req,
        res,
        next,
        app,
        currentRoute
    }
}

export let Apollo :ApolloType;