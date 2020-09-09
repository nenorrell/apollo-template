import { DB } from "../modules/db/db";
import express, { NextFunction, Response, Request } from "express";
import { Route } from "./Routes/resources/Route";

export type ApolloType = {
    req :Request;
    res :Response;
    next :NextFunction;
    db ?:DB;
    app :express.Application;
    currentRoute :Route;
}

export const buildApolloObj = (req :Request, res :Response, next :NextFunction, db :DB, app:express.Application, currentRoute :Route) :void => {
    Apollo = {
        req,
        res,
        next,
        db,
        app,
        currentRoute
    }
}

export let Apollo :ApolloType;