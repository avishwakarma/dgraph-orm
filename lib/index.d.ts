/**
 * dgraph-orm
 *
 * Simplified schema creation, queries and mutations for Dgraph.
 *
 * @author Ashok Vishwakarma <akvlko@gmail.com>
 *
 * @uses npm install dgraph-orm
 * @docs https://ashokvishwakarma.github.io/dgraph-orm
 *
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
/**
 * Model
 *
 * dgraph-orm Model class
 */
import Model from './model';
import { TypesType, SchemaFields, ConnectionConfig, QueryParams } from './types';
/**
 * DgraphORM
 *
 * DgraphORM class
 */
declare class DgraphORM {
    /**
     * _logger
     *
     * @type Function
     * Methods for logging
     */
    private _logger;
    /**
     * connection
     *
     * @type Connection
     * connection object
     */
    private connection;
    /**
     * _models
     *
     * @type any
     * created models
     */
    models: any;
    /**
     * Types
     *
     * @type TypesType
     * Field types for dagraph-orm
     */
    Types: TypesType;
    /**
     * Schema
     *
     * @type {new(name: string, schema: SchemaFields): Schema}
     *
     * Schema class
     */
    Schema: {
        new (name: string, schema: SchemaFields): Schema;
    };
    /**
     * contructor
     */
    constructor();
    /**
     * disconnect
     *
     * @returns void
     *
     * disconnect the dgraph connection
     */
    disconnect(): void;
    /**
     * logging
     * @param callback {Function}
     *
     * @returns void
     */
    logging(callback: Function): void;
    /**
     * _log
     *
     * @param message {string}
     *
     * @returns void
     */
    private _log;
    /**
     * _set_model
     *
     * @param schema {Schema}
     *
     * @returns void
     */
    private _set_model;
    /**
     * _generate_schema
     *
     * @param schema {Array<string>}
     *
     * @returns void
     */
    _generate_schema(schema: Array<string>): Promise<any>;
    /**
     * _create_connection
     *
     * @param config {ConnectionConfig}
     *
     * @returns Connection
     */
    private _create_connection;
    /**
     * model
     *
     * @param schema {Schema}
     *
     * @returns Model
     */
    model(schema: Schema): Model;
    /**
     * connect
     *
     * @param config {ConnectionConfig}
     *
     * @returns void
     */
    connect(config: ConnectionConfig): Connection;
    /**
     * query
     *
     * @param params {QueryParams}
     *
     * @returns Promise<any>
     */
    query(params: QueryParams): Promise<any>;
    /**
     * mutate
     *
     * @param mutation {string}
     *
     * @returns Promise<any>
     */
    mutate(mutation: string): Promise<any>;
}
declare const _default: DgraphORM;
export default _default;
