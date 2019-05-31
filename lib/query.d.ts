import { Params } from './types';
declare class Query {
    private name;
    private params;
    private type;
    private field;
    private value;
    private logger;
    private where;
    query: string;
    constructor(type: string, field: string, value: any, params: Params, name: string, logger: Function);
    private _where;
    private _filter;
    private _parse_filter;
    private _attributes;
    private _include;
    private _extras;
    private _parse_order;
    private _build;
}
export default Query;
