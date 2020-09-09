export type ColumnMap = Map<string, | string | number>;

export type ColumnArray = Array<string>;

export type ColumnValueObject = {
    columns :Array<string>,
    values :Array<any>
}

export type Field = {
    name :string;
    value :string | number;
    operator ?:string
}

export type QueryOptions = {
    limit ?:number;
    offset ?:number;
}