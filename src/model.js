const Query = require('./query');

class Model{
  constructor(schema, models, connection) {
    this.schema = schema;
    this.models = models;
    this.connection = connection;
    
    return {
      schema: this.schema,
      query: this.query.bind(this),
      mutate: this.mutate.bind(this),
      find: this.find.bind(this),
      findByUid: this.findByUid.bind(this)
    }
  }

  query(params) {
    return this.client.newTxn().queryWithVars(params.query, params.variables);
  }

  mutate(params) {
    const mu = new this.connection.Mutation();
    mu.setSetJson(params.mutation);
    return this.connection.client.newTxn().mutate(mu);
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
 
  _validate(original, params) {
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

  find(params) {
    params = this._validate(this.schema.original, params || {});
    const query = new Query(this.schema.name, params);

    //console.log(query);

    // return this._execute(query);
  }

  _execute(query) {
    return this.connection.client.newTxn().query(query);
  }

  findByUid(uid, params) {
    params = this._validate(this.schema.original, params || {});
    const query = new Query(this.schema.name, {
      ...params,
      where: {
        $uid: uid
      }
    });

    //return this._execute(query);
  }
}

module.exports = Model;