/**
 * Model
 *
 * dgraph-orm Model class
 *
 * @author Ashok Vishwakarma <akvlko@gmail.com>
 */
/**
 * Schema
 *
 * dgraph-orm Schema class
 */
import Schema from './schema';
/**
 * Connection
 *
 * dgraph-orm Connection class
 */
import Connection from './connection';
import { QueryParams, RelationParam } from './types';
/**
 * Model
 *
 * Class Model
 */
declare class Model {
    /**
     * index type support
     */
    [index: string]: any;
    /**
     * schema
     *
     * @type Schema
     */
    schema: Schema;
    /**
     * connection
     *
     * @type Connection
     */
    connection: Connection;
    /**
     * _models
     *
     * @type any
     */
    private _models;
    /**
     * _logger
     *
     * @type Function
     */
    private _logger;
    /**
     * contructor
     * @param schema {Schema}
     * @param models {any}
     * @param connection {Connection}
     * @param logger {Function}
     */
    constructor(schema: Schema, models: any, connection: Connection, logger: Function);
    relation(uid: string, params: RelationParam): Promise<any>;
    /**
     * _check_if_password_type
     *
     * @param field {string}
     *
     * @returns boolean
     */
    private _check_if_password_type;
    /**
     * checkPassword
     * @param uid {string}
     * @param field {string}
     * @param password {string}
     *
     * @returns Promise<new>
     */
    checkPassword(uid: string, field: string, password: string): Promise<any>;
    /**
     * _generate_methods
     *
     * @returns void
     */
    private _generate_methods;
    /**
     * _execute
     * @param query {string}
     *
     * @returns Promise<new>
     */
    private _execute;
    /**
     * _method
     * @param type {string}
     * @param field {any}
     * @param value {any}
     * @param params {any}
     *
     * @returns Promise<new>
     */
    private _method;
    /**
     * query
     * @param query {string}
     *
     * @returns Promise<new>
     */
    query(query: string): Promise<any>;
    /**
     * queryWithVars
     * @param params {QueryParams}
     *
     * @returns Promise<new>
     */
    queryWithVars(params: QueryParams): Promise<any>;
    /**
     * _is_relation
     * @param _key {string}
     *
     * @returns boolean
     */
    private _is_relation;
    /**
     * _parse_mutation
     * @param mutation {any}
     * @param name {string}
     *
     * @returns {[index: string]: any}
     */
    private _parse_mutation;
    /**
     * _create
     * @param mutation {any}
     *
     * @returns Promise<any>
     */
    private _create;
    /**
     * create
     * @param data {any}
     *
     * @returns Promise<any>
     */
    create(data: any): Promise<any>;
    /**
     * _update
     * @param mutation {any}
     * @param uid {any}
     *
     * @returns Promise<any>
     */
    private _update;
    /**
     * update
     * @param data {any}
     * @param uid {any}
     *
     * @returns Promise<any>
     */
    update(data: any, uid: any): Promise<any>;
    /**
     * _delete
     * @param mutation {any}
     *
     * @returns Promise<any>
     */
    private _delete;
    /**
     * delete
     * @param params {any}
     * @param uid {any}
     *
     * @returns Promise<any>
     */
    delete(params: any, uid?: any): Promise<any>;
    /**
     * _get_unique_fields
     *
     * @returns Array<string>
     */
    private _get_unique_fields;
    /**
     * _check_unique_values
     * @param mutation {any}
     * @param _txn {any}
     *
     * @returns Promise<any>
     */
    private _check_unique_values;
    /**
     * _lang_fields
     * @param original {any}
     *
     * @returns Array<string>
     */
    private _lang_fields;
    /**
     * _check_attributes
     * @param original {any}
     * @param attributes {any}
     * @param isUpdate {boolean}
     * @param isRelation {boolean}
     *
     * @returs void
     */
    private _check_attributes;
    /**
     * _all_attributes
     * @param original {any}
     *
     * @return Array<string>
     */
    private _all_attributes;
    /**
     * _validate
     * @param original {any}
     * @param params {any}
     *
     * @returns Params
     */
    private _validate;
}
export default Model;
