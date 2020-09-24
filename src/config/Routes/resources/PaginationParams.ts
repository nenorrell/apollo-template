import { RouteParam, ParamDataTypes } from "./RouteParam";

export const PaginationParams = [
    new RouteParam()
    .setName("pageSize")
    .setDescription("The amount of items to return for each page (max 50)")
    .setType(ParamDataTypes.number)
    .setRequired(false),

    new RouteParam()
    .setName("page")
    .setType(ParamDataTypes.number)
    .setRequired(false)
    .setDescription("The page number you're requesting")
]