/**
 * Query
 *
 * dgraph-orm Query class
 *
 * @author Ashok Vishwakarma <akvlko@gmail.com>
 */
import { Params } from './types';
/**
 * Query
 *
 * Class Query
 */
declare class Query {
    /**
     * name
     *
     * @type string
     */
    private name;
    /**
     * params
     *
     * @type Params
     */
    private params;
    /**
     * type
     *
     * @type string
     */
    private type;
    /**
     * field
     *
     * @type string
     */
    private field;
    /**
     * value
     *
     * @type any
     */
    private value;
    /**
     * logger
     *
     * @type Function
     */
    private logger;
    /**
     * where
     *
     * @type any
     */
    private where;
    /**
     * query
     *
     * @type string
     */
    query: string;
    /**
     * constructor
     * @param type {string}
     * @param field {string}
     * @param value {any}
     * @param params {Params}
     * @param name {string}
     * @param logger {Function}
     */
    constructor(type: string, field: string, value: any, params: Params, name: string, logger: Function);
    /**
     * _where
     * @param type {string}
     * @param field {string}
     * @param value {any}
     * @param name {string}
     *
     * @returns string
     */
    private _where;
    /**
     * _filter
     * @param key {string}
     * @param value {any}
     * @param name {string}
     *
     * @returns string
     */
    private _filter;
    /**
     * _parse_filter
     * @param filter {any}
     * @param name {string}
     *
     * @returns string
     */
    private _parse_filter;
    /**
     * _attributes
     * @param attributes {Array<string>}
     * @param name {string}
     *
     * @return string
     */
    private _attributes;
    /**
     * _include
     * @param include {Include}
     *
     * @returns string
     */
    private _include;
    /**
     * _extra
     * @param params {Params}
     *
     * @return string
     */
    private _extras;
    /**
     * _parse_order
     * @param order {Array<string>}
     *
     * @returns string
     */
    private _parse_order;
    /**
     * _build
     * @param params {any}
     *
     * @returns string
     */
    private _build;
}
export default Query;
