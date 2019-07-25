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
 * Operation
 * 
 * from dgraph-js to perform database operation
 * 
 * https://www.npmjs.com/package/dgraph-js
 */
import { Operation } from 'dgraph-js';

/**
 * Mutation
 * 
 * from dgraph-orm for mutation
 */
import { Mutation } from 'dgraph-js/generated/api_pb';

/**
 * Schema
 * 
 * dgraph-orm Schema class
 */
import Schema from './schema';

/**
 * Types
 * 
 * dgraph-orm feilds Types
 */
import Types from './helpers/types';

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
class DgraphORM {

  /**
   * _logger
   * 
   * @type Function
   * Methods for logging
   */
  private _logger: Function = () => {};

  /**
   * connection
   * 
   * @type Connection
   * connection object
   */
  private connection: Connection;

  /**
   * _models
   * 
   * @type any
   * created models
   */
  models: any = {};

  /**
   * Types
   * 
   * @type TypesType
   * Field types for dagraph-orm
   */
  Types: TypesType = Types;

  /**
   * Schema
   * 
   * @type {new(name: string, schema: SchemaFields): Schema}
   * 
   * Schema class
   */
  Schema: {new(name: string, schema: SchemaFields): Schema} = Schema;

  /**
   * contructor
   */
  constructor() {
    this.connection = this._create_connection();
  }

  /**
   * disconnect
   * 
   * @returns void
   * 
   * disconnect the dgraph connection
   */
  disconnect(): void {
    this.connection.close();
  }

  /**
   * logging
   * @param callback {Function}
   * 
   * @returns void
   */
  logging(callback: Function): void {
    this._logger = callback;
  }

  /**
   * _log
   * 
   * @param message {string}
   * 
   * @returns void
   */
  private _log(message: string): void {
    this._logger(message);
  }


  /**
   * _set_model
   * 
   * @param schema {Schema}
   * 
   * @returns void
   */
  private _set_model(schema: Schema): void {
    if(schema.name && typeof this.models[schema.name] === 'undefined') {
      this.models[schema.name] = schema.original;
      this._generate_schema(schema.schema);
    }
  }

  /**
   * _generate_schema
   * 
   * @param schema {Array<string>}
   * 
   * @returns void
   */
  async _generate_schema(schema: Array<string>): Promise<any> {
    const op: Operation  = new this.connection.dgraph.Operation();
    op.setSchema(schema.join("\n"));
    this.connection.client.alter(op).catch(error => {});
  }

  /**
   * _create_connection
   * 
   * @param config {ConnectionConfig}
   * 
   * @returns Connection
   */
  private _create_connection(config: ConnectionConfig = null): Connection {
    return new Connection(config, this._log.bind(this));
  }

  /**
   * model
   * 
   * @param schema {Schema}
   * 
   * @returns Model
   */
  model(schema: Schema): Model {
    this._set_model(schema);

    return new Model(schema, this.models, this.connection, this._log.bind(this));
  }

  /**
   * connect
   * 
   * @param config {ConnectionConfig}
   * 
   * @returns void
   */
  connect(config: ConnectionConfig): Connection  {
    this.connection = this._create_connection(config);
    return this.connection;
  }

  /**
   * query
   * 
   * @param params {QueryParams}
   * 
   * @returns Promise<any>
   */
  query(params: QueryParams): Promise<any> {
    return this.connection.client
      .newTxn()
      .queryWithVars(
        params.query,
        params.variables
      );
  }

  /**
   * mutate
   * 
   * @param mutation {string}
   * 
   * @returns Promise<any>
   */
  mutate(mutation: string): Promise<any> {
    const mu: Mutation = new this.connection.dgraph.Mutation();
    mu.setSetJson(mutation);
    return this.connection.client.newTxn()
      .mutate(mu);
  }
}

export default new DgraphORM();