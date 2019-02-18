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
      create: this.create.bind(this),
      update: this.update.bind(this),
      delete: this.delete.bind(this),
      checkPassword: this.checkPassword.bind(this),
      ..._methods
    }
  }

  _check_if_password_type(field) {
    const _field = this.schema.original[field];

    if(typeof _field === 'undefined') {
      return false;
    }

    if(typeof _field === 'string' && _field === 'password') {
      return true;
    }

    if(typeof _field === 'object' && _field.type === 'password') {
      return true;
    }

    return false;
  }

  async checkPassword(uid, field, password) {
    return new Promise(async (resolve, reject) => {
      try {

        if(!this._check_if_password_type(field)) {
          throw new Error(`Field ${field} is not of type PASSWORD.`)
        }

        const check = await this._execute(`{
          ${this.schema.name} (func: uid(${uid})) {
            isValid: checkpwd(${this.schema.name}.${field}, "${password}")
          }
        }`);

        if(check.length === 0) {
          return resolve(false);
        }

        return resolve(check[0].isValid);

      } catch (error) {
        return reject(error);
      }
    });
  }

  _generate_methods() {
    const _methods = {};
    Object.keys(methods).forEach(_method => {
      _methods[_method] = this._method.bind(this, _method);
    });

    return _methods;
  }

  _execute(query) {
    return new Promise(async (resolve, reject) => {
      const _txn = this.connection.client.newTxn();

      try {
        const res = await _txn.query(query);
        // await _txn.commit();
        return resolve(res.getJson()[this.schema.name]);
      } catch (error) {
        await _txn.discard();
        return reject(error);
      } finally {
        await _txn.discard();
      }
    })
  }

  async _method(type, field, value, params) {    
    if(type === methods.uid || type === methods.has) {
      params = value;
      value = field;
    }
    
    params = this._validate(this.schema.original, params);
    
    const query = new Query(type, field, value, params, this.schema.name, this._logger);

    return this._execute(query.query);
  }

  async query(query) {
    return new Promise(async (resolve, reject) => {
      const _txn = this.connecton.client.newTxn();

      try {
        const data = await _txn.query(query);
        // await _txn.commit();
        return resolve(data.getJson());
      } catch (error) {
        await _txn.discard();

        return reject(error);
      } finally {
        await _txn.discard();
      }
    });
  }

  async queryWithVars(params) {
    return new Promise(async (resolve, reject) => {
      const _txn = this.connection.client.newTxn();

      try {
        const data = await _txn.queryWithVars(params.query, params.variables);
        //await _txn.commit();

        return resolve(data.getJson());
      } catch (error) {
        await _txn.discard();
        return reject(error);
      } finally {
        await _txn.discard();
      }
    });
  }

  _is_relation(_key) {
    const _field = this.schema.original[_key];

    if(typeof _field !== 'undefined' && _field.type === 'uid') {
      return true;
    }

    return false;
  }

  _parse_mutation(mutation, name) {
    let _mutation = {};

    Object.keys(mutation).forEach(_key => {
      if(this._is_relation(_key)) {
        if(Array.isArray(mutation[_key])) {
          const _m = [];
          mutation[_key].forEach(_uid => {
            _m.push({
              uid: _uid
            })
          });
          _mutation[`${name}.${_key}`] = _m;
        }else {
          _mutation[`${name}.${_key}`] = {
            uid: mutation[_key]
          };
        }
      }else {
        _mutation[`${name}.${_key}`] = mutation[_key];
      }
    });

    return _mutation;
  }

  _create(mutation) {
    return new Promise(async (resolve, reject) => {
      const _txn = this.connection.client.newTxn();

      try {
        const mu = new this.connection.dgraph.Mutation();
        mu.setSetJson(mutation);

        const _unique_check = await this._check_unique_values(mutation, _txn);

        if(_unique_check) {
          await _txn.discard();
          return reject(new Error(`[Unique Constraint]: ${_unique_check}`));
        }

        mu.setCommitNow(true);
        mu.setIgnoreIndexConflict(true);
        
        const _mutation = await _txn.mutate(mu);
        await _txn.commit();

        const _uid = _mutation.wrappers_[1].get('blank-0');
        const data = await this._method('uid', _uid);

        return resolve(data[0]);
      } catch (error) {
        await _txn.discard();
        return reject(error);
      } finally {
        await _txn.discard();
      }
    });
  }

  async create(data) {
    this._check_attributes(this.schema.original, Object.keys(data));
    const mutation = this._parse_mutation(data, this.schema.name);
    return this._create(mutation);
  }

  _update(mutation, uid) {
    return new Promise(async (resolve, reject) => {
      const _txn = this.connection.client.newTxn();

      try {
        const mu = new this.connection.dgraph.Mutation();
        mutation.uid = uid;
        mu.setCommitNow(true);
        mu.setIgnoreIndexConflict(true);

        mu.setSetJson(mutation);
        
        await _txn.mutate(mu);
        return resolve(true);
      } catch (error) {
        await _txn.discard();
        return reject(error);
      } finally {
        await _txn.discard();
      }
    });
  }

  async update(data, uid) {

    if(!uid) {
      return;
    }

    if(Object.keys(data).length === 0) {
      return;
    }

    this._check_attributes(this.schema.original, Object.keys(data), true);
    const mutation = this._parse_mutation(data, this.schema.name);

    if(typeof uid === 'string') {
      return this._update(mutation, uid);
    }

    if(typeof uid === 'object') {
      const _keys = Object.keys(uid);
      const _first = _keys.splice(0, 1)[0];

      const _filter = {};

      if(_keys.length > 0) {
        _keys.forEach(_key => {
          _filter[_key] = {
            $eq: uid[_key]
          }
        });
      }
      
      const data = await this._method('eq', _first, uid[_first], {
        filter: _filter
      });

      if(data.length > 0) {
        this._update(mutation, data[0].uid);
      }
    }
  }

  _delete(mutation) {
    return new Promise(async (resolve, reject) => {
      const _txn = this.connection.client.newTxn();

      try {
        const mu = new this.connection.dgraph.Mutation();
        mu.setCommitNow(true);
        mu.setIgnoreIndexConflict(true);
        mu.setDeleteJson(mutation);
        
        await _txn.mutate(mu);
        return resolve(true);
      } catch (error) {
        await _txn.discard();
        return reject(error);
      } finally {
        await _txn.discard();
      }
    });
  }

  async delete(params, uid) {

    if(!uid) {
      if(typeof params === 'string') {
        return this._delete({
          uid: params
        });
      }
  
      if(Array.isArray(params)) {
        const _uids = [];
        for(let _uid in params) {
          _uids.push({
            uid: _uid
          });
        }
  
        return this._delete(_uids);
      }
    }else {
      let _params = {};

      this._check_attributes(this.schema.original, Object.keys(params), true);

      for(let _key of Object.keys(params)) {
        if(this._is_relation(_key)) {
          if(Array.isArray(params[_key])) {
            const _a = [];
            params[_key].forEach(_uid => {
              _a.push({
                uid: _uid
              });
            });
            _params[`${this.schema.name}.${_key}`] = _a;
          }else {
            _params[`${this.schema.name}.${_key}`] = {
              uid: params[_key]
            };
          }
        }else {
          _params[`${this.schema.name}.${_key}`] = null;
        }
      }

      if(Array.isArray(uid)) {
        const _p = [];
        uid.forEach(_uid => {
          _params.uid = _uid;
          _p.push(_params);
        });

        return this._delete(_p);
      }

      _params.uid = uid;
      return this._delete(_params);

    }
  }

  _get_unique_fields() {
    const _unique = [];

    Object.keys(this.schema.original).forEach(_key => {
      if(this.schema.original[_key].unique) {
        _unique.push(_key);
      }
    });

    return _unique;
  }

  async _check_unique_values(mutation, _txn) {
    const _unique = this._get_unique_fields();

    if(_unique.length === 0) {
      return false;
    }

    return new Promise(async (resolve, reject) => {
      for(let _key of _unique) {
        let _mvalue = mutation[`${this.schema.name}.${_key}`];
        if(this.schema.original[_key].type === 'string') {
          _mvalue = '"' + _mvalue + '"';
        }
        const _value = await _txn.query(
          `{
           data (func: eq(${this.schema.name}.${_key}, ${_mvalue})) {
            ${_key}: ${this.schema.name}.${_key}
           } 
          }`
        );

        if(_value.getJson().data.length > 0) {
          return resolve(`Duplicate value for ${_key}`);
        }
      }

      return resolve(false);
    });
  }

  _check_attributes(original, attributes, isUpdate = false){
    if(!attributes || attributes.length === 0) {
      return;
    }

    for(let attribute of attributes) {
      if(typeof original[attribute] === 'undefined') {
        throw new Error(`${this.schema.name} has no attribute ${attribute}`);
      }else if(typeof original[attribute] === 'object' && original[attribute].type === 'uid' && !isUpdate) {
        throw new Error(`${attribute} is a realtion and must be in include.`);
      }
    }
  }

  _all_attributes(original) {
    const _attrs = [];
    for(let attr of Object.keys(original)) {
      if(original[attr].type === 'uid' || original[attr] === 'password' || original[attr].type === 'password') {
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

    const _index = params.attributes.indexOf('uid');
    
    if(_index !== -1) {
      params.attributes.splice(_index, 1);
    }
    
    this._check_attributes(original, params.attributes);

    params.attributes.unshift('uid');

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
}

module.exports = Model;