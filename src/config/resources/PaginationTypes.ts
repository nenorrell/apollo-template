export type Pagination = {
    data :any;
    page: {
        size :number;
        prev :string;
        current :number;
        next :string;
    }
}

export type PaginationQuery = {
    limit :number;
    skip :number;
}

export type PaginationConfig = {
    page :number;
    pageSize :number;
    sortBy ?:string;
    direction ?:string;
}