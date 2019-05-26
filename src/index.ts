import Schema from './schema';
import Types from './helpers/types';
import Connection from './connection';
import Model from './model';

class DgraphSchema {
  private _models: Array<any> = [];
  private _logger: Function = console.log;
  private connection: any;

  Types: any = Types;
  Schema: any = Schema;

  constructor() {
    this.connection = this._create_connection();
  }

  disconnect() {
    this.connection.close();
  }

  logging(callback: any) {
    this._logger = callback;
  }

  _log(message: any) {
    this._logger(message);
  }

  async _set_model(schema: any) {
    if(typeof this._models[schema.name] === 'undefined') {
      this._models[schema.name] = schema.original;
      const op = new this.connection.dgraph.Operation();
      op.setSchema(schema.schema.join("\n"));
      await this.connection.client.alter(op);
    }
  }

  private _create_connection(config: any = null): any {
    return new Connection(config, this._log.bind(this));
  }

  model(schema: any) {
    this._set_model(schema);

    return new Model(schema, this._models, this.connection, this._log.bind(this));
  }

  connect(config: any) {
    this.connection = this._create_connection(config);
  }

  query(params: any) {
    return this.connection.client
      .newTxn()
      .queryWithVars(
        params.query,
        params.variables
      );
  }

  mutate(mutation: any) {
    const mu = new this.connection.Mutation();
    mu.setSetJson(mutation);
    return this.connection.client.newTxn()
      .mutate(mu);
  }
}

export default new DgraphSchema();