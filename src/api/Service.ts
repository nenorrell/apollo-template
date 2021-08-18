import {parse} from "url";
import { DB } from '../modules/db/db';
import { Apollo } from '../config/Apollo';
import {Pagination, PaginationQuery, PaginationConfig} from '../config/resources/PaginationTypes';
import { getAppUrl, formatError } from '../modules/utility';
import {Request, Response, NextFunction, request, query} from 'express';
import { QueryOptions } from '../modules/db/db.types';
import { Route } from '../config/Routes/resources/Route';

export class Service{
    protected req :Request = Apollo.req; 
    protected res :Response = Apollo.res;
    protected next :NextFunction = Apollo.next;
    protected currentRoute ?:Route = Apollo.currentRoute;
    protected db ?:DB = Apollo.db;
    protected paging :PaginationConfig = {
        page: 1,
        pageSize: 25
    };

    protected getPaginationParams() :PaginationQuery{
        try{
            let hasParams = this.currentRoute.hasQueryParam("page") && this.currentRoute.hasQueryParam("pageSize");
            if(hasParams){
                this.paging.page = <any>this.req.query['page'] || this.paging.page;
                this.paging.pageSize = <any>this.req.query['pageSize'] || this.paging.pageSize;
        
                if(this.paging.pageSize > 50){
                    throw formatError(400, "Page size can not exceed 50");
                }
                return {
                    limit: this.paging.pageSize,
                    skip: (this.paging.page - 1) * this.paging.pageSize
                }
            }
            else{
                throw "Pagination params not configured for this route";
            }
        }
        catch(e){
            throw e;
        }
    }

    protected getSortByParam() :QueryOptions{
        try{
            let hasParams = this.currentRoute.hasQueryParam("sortBy") || this.currentRoute.hasQueryParam("direction");
            if(hasParams){
                let sortBy = <any>this.req.query['sortBy'];
                let direction = <any>this.req.query['direction'];
                if(sortBy){
                    return {
                        orderBy: sortBy || null,
                        direction: direction || null
                    }
                }
                return {};
            }
            else{
                throw "Sort by is not configured for this route";
            }
        }
        catch(e){
            throw e;
        }
    }

    public paginate(data :Array<any>) :Pagination{
        let host = getAppUrl();
        let url = `${host}${this.req.path}`;
        let args = "";
        let queryKeys = this.currentRoute.queryParamKeys;
        for(let i=0; i<queryKeys.length; i++){
            let param = queryKeys[i];
            if(param !== "page" && param !== "pageSize"){
                if(this.req.query[param]){
                   args += `${param}=${this.req.query[param]}&`;
                }
            }
        }
        
        let next = data.length < this.paging.pageSize ? '' : `${url}?${args}page=${this.paging.page+1}&pageSize=${this.paging.pageSize}`,
        prev = this.paging.page == 1 ? '' : `${url}?${args}page=${this.paging.page-1}&pageSize=${this.paging.pageSize}`;

        return {
            data,
            page: {
                size: this.paging.pageSize,
                prev: prev,
                current: this.paging.page,
                next: next
            }
        }
    }
}