import { Operation } from 'dgraph-js';
import { Mutation } from 'dgraph-js/generated/api_pb';
import Schema from './schema';
import Types from './helpers/types';
import Connection from './connection';
import Model from './model';
import { TypesType, SchemaFields, ConnectionConfig, QueryParams } from './types';

class DgraphSchema {
  private _models: any = {};
  private _logger: Function = console.log;
  private connection: Connection;

  Types: TypesType = Types;
  Schema: {new(name: string, schema: SchemaFields): Schema} = Schema;

  constructor() {
    this.connection = this._create_connection();
  }

  disconnect() {
    this.connection.close();
  }

  logging(callback: Function) {
    this._logger = callback;
  }

  _log(message: string) {
    this._logger(message);
  }

  async _set_model(schema: Schema) {
    if(schema.name && typeof this._models[schema.name] === 'undefined') {
      this._models[schema.name] = schema.original;
      const op: Operation  = new this.connection.dgraph.Operation();
      op.setSchema(schema.schema.join("\n"));
      await this.connection.client.alter(op);
    }
  }

  private _create_connection(config: ConnectionConfig = null): Connection {
    return new Connection(config, this._log.bind(this));
  }

  model(schema: Schema): Model {
    this._set_model(schema);

    return new Model(schema, this._models, this.connection, this._log.bind(this));
  }

  connect(config: ConnectionConfig): void {
    this.connection = this._create_connection(config);
  }

  query(params: QueryParams): Promise<any> {
    return this.connection.client
      .newTxn()
      .queryWithVars(
        params.query,
        params.variables
      );
  }

  mutate(mutation: string): Promise<any> {
    const mu: Mutation = new this.connection.dgraph.Mutation();
    mu.setSetJson(mutation);
    return this.connection.client.newTxn()
      .mutate(mu);
  }
}

export default new DgraphSchema();