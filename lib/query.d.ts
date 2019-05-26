declare class Query {
    private name;
    private params;
    private type;
    private field;
    private value;
    private logger;
    private where;
    query: string;
    constructor(type: any, field: any, value: any, params: any, name: any, logger: Function);
    private _compose_params;
    private _where;
    private _filter;
    private _parse_first_where;
    private _parse_filter;
    private _attributes;
    private _include;
    private _extras;
    private _parse_order;
    private _build;
}
export default Query;
