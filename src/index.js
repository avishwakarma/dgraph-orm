const Schema = require('./schema');
const Types = require('./helpers/types');
const Connection = require('./connection');
const Model = require('./model');

class DgraphSchema {
  constructor() {
    this._models = [];
    this.connection = this._create_connection();
    
    return {
      connect: this.connect.bind(this),
      Schema: Schema,
      model: this.model.bind(this),
      Types: Types
    }
  }

  async _set_model(schema) {
    if(typeof this._models[schema.name] === 'undefined') {
      this._models[schema.name] = true;
      const op = new this.connection.Operation();
      op.setSchema(schema.schema.join("\n"));
      await this.connection.client.alter(op);
    }
  }

  _create_connection(config) {
    return new Connection(config);
  }

  model(schema) {
    this._models[schema.name] = schema.original;
    this._set_model(schema);

    return new Model(schema, this._models, this.connection);

    // return {
    //   query: this.query.bind(this),
    //   mutate: this.mutate.bind(this)
    // }
  }

  connect(config) {
    this.connection = this._create_connection(config);
  }

  query(params) {
    return this.connection.client
      .newTxn()
      .queryWithVars(
        params.query,
        params.variables
      );
  }

  mutate(mutation) {
    const mu = new this.connection.Mutation();
    mu.setSetJson(mutation);
    return this.connection.client.newTxn()
      .mutate(mu);
  }
}

module.exports = new DgraphSchema();