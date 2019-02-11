const Query = require('./query');
const methods = require('./helpers/methods');

class Model{
  constructor(schema, models, connection, logger) {
    this.schema = schema;
    this.models = models;
    this.connection = connection;
    this._logger = logger;

    const _methods = this._generate_methods()
    
    return {
      schema: this.schema,
      queryWithVars: this.queryWithVars.bind(this),
      query: this.query.bind(this),
      mutate: this.mutate.bind(this),
      ..._methods
    }
  }

  _generate_methods() {
    const _methods = {};
    Object.keys(methods).forEach(_method => {
      _methods[_method] = this._method.bind(this, _method);
    });

    return _methods;
  }

  _method(type, field, value, params) {    
    if(type === methods.uid || type === methods.has) {
      params = value;
      value = field;
    }
    
    params = this._validate(this.schema.original, params);

    const query = new Query(type, field, value, params, this.schema.name, this._logger);

    return this._execute(query.query);
  }

  query(query) {
    return new Promise((resolve, reject) => {
      return this.connecton.client
        .newTxn()
        .query(query)
        .then(res => {
          return resolve(res.getJson());
        }).catch(error => {
          this._logger(error);
          return reject(error);
        });
    })
  }

  queryWithVars(params) {
    return new Promise((resolve, reject) => {
      return this.connecton.client
        .newTxn()
        .queryWithVars(params.query, params.variables)
        .then(res => {
          return resolve(res.getJson());
        }).catch(error => {
          this._logger(error);
          return reject(error);
        });
    });
  }

  mutate(params) {
    return new Promise((resolve, reject) => {
      const mu = new this.connection.Mutation();
      mu.setSetJson(params.mutation);
      return this.connection.client
        .newTxn()
        .mutate(mu)
        .then(res => {
          return resolve(res.getJson());
        }).catch(error => {
          this._logger(error);
          return reject(error);
        });
    })
  }

  _check_attributes(original, attributes){
    if(!attributes || attributes.length === 0) {
      return;
    }

    for(let attribute of attributes) {
      if(typeof original[attribute] === 'undefined') {
        throw new Error(`${this.schema.name} has no attribute ${attribute}`);
      }else if(typeof original[attribute] === 'object' && original[attribute].type === 'uid') {
        throw new Error(`${attribute} is a realtion and must be in include.`);
      }
    }
  }

  _all_attributes(original) {
    const _attrs = [];
    for(let attr of Object.keys(original)) {
      if(original[attr].type === 'uid') {
        continue;
      }
      _attrs.push(attr);
    }

    return _attrs;
  }
 
  _validate(original, params = {}) {
    if(!params.attributes || params.attributes.length === 0) {
      params.attributes = this._all_attributes(original);
    }
    
    this._check_attributes(original, params.attributes);

    if(params.include) {
      for(let relation of Object.keys(params.include)) {
        if(typeof original[relation] === 'undefined') {
          throw new Error(`${this.schema.name} has no relation ${relation}`);
        }

        params.include[relation].model = original[relation].model;

        this._validate(this.models[original[relation].model], params.include[relation]);
      }
    }

    return params;
  }

  _execute(query) {
    return new Promise((resolve, reject) => {
      return this.connection.client.newTxn().query(query).then(res => {
        return resolve(res.getJson()[this.schema.name]);
      }).catch(error => {
        this._logger(error);
        return reject(error);
      });
    })
  }
}

module.exports = Model;