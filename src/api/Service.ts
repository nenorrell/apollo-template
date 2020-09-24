import { DB } from '../modules/db/db';
import { Apollo } from '../config/Apollo';
import {Pagination, PaginationQuery, PaginationConfig} from '../config/resources/PaginationTypes';
import { getAppUrl, formatError } from '../modules/utility';
import {Request, Response, NextFunction} from 'express';
import { QueryOptions } from '../modules/db/db.types';

export class Service{
    protected req :Request = Apollo.req; 
    protected res :Response = Apollo.res;
    protected next :NextFunction = Apollo.next;
    protected db ?:DB = Apollo.db;
    protected paging :PaginationConfig = {
        page: 1,
        pageSize: 25
    };

    protected getPaginationParams() :PaginationQuery{
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

    protected getSortByParam(choices :Array<string>) :QueryOptions{
        let param = <any>this.req.query['sortBy'];
        let direction = <any>this.req.query['direction'];
        if(param){
            if(choices.includes(param)){
                this.paging.sortBy = param;
                this.paging.direction = direction;

                return {
                    orderBy: this.paging.sortBy,
                    direction
                }
            }
        }
        return {};
    }

    public paginate(data :Array<any>) :Pagination{
        let host = getAppUrl();
        let url = `${host}${this.req.path}`;

        let next = data.length < this.paging.pageSize ? '' : `${url}?page=${this.paging.page+1}&pageSize=${this.paging.pageSize}`,
        prev = this.paging.page == 1 ? '' : `${url}?page=${this.paging.page-1}&pageSize=${this.paging.pageSize}`;

        if(next && this.paging.sortBy){
            next += `&sortBy=${this.paging.sortBy}`;
        }
        if(prev && this.paging.sortBy){
            prev += `&sortBy=${this.paging.sortBy}`;
        }

        if(next && this.paging.direction){
            next += `&direction=${this.paging.direction}`;
        }
        if(prev && this.paging.direction){
            prev += `&direction=${this.paging.direction}`;
        }

        return {
            data: data,
            page: {
                size: this.paging.pageSize,
                prev: prev,
                current: this.paging.page,
                next: next
            }
        }
    }
}