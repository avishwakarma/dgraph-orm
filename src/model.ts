/**
 * Model
 * 
 * dgraph-orm Model class
 * 
 * @author Ashok Vishwakarma <akvlko@gmail.com>
 */

/**
 * Query
 * 
 * dgraph-orm Query class
 */
import Query from './query';

/**
 * methods
 * 
 * dgraph-orm model methods
 */
import methods from './helpers/methods';

/**
 * pluck
 * 
 * pluck utility method
 */
import { pluck } from './helpers/utility';

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

import { QueryParams, FieldProps, Params } from './types';

/**
 * Mutation
 * 
 * Type Mutation from dgraph-js
 */
import { Mutation } from 'dgraph-js/generated/api_pb';

/**
 * Txn
 * 
 * Type Txn from dgraph-js
 */
import { Txn } from 'dgraph-js';

/**
 * Model
 * 
 * Class Model
 */
class Model {
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
  private _models: any;

  /**
   * _logger
   * 
   * @type Function
   */
  private _logger: Function;

  /**
   * contructor
   * @param schema {Schema} 
   * @param models {any}
   * @param connection {Connection}
   * @param logger {Function}
   */
  constructor(schema: Schema, models: any, connection: Connection, logger: Function) {
    this.schema = schema;
    this._models = models;
    this.connection = connection;
    this._logger = logger;

    this._generate_methods();
  }

  /**
   * _check_if_password_type
   * 
   * @param field {string}
   * 
   * @returns boolean
   */
  private _check_if_password_type(field: string): boolean {
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

  /**
   * checkPassword
   * @param uid {string}
   * @param field {string}
   * @param password {string}
   * 
   * @returns Promise<new>
   */
  async checkPassword(uid: string, field: string, password: string): Promise<any> {
    return new Promise(async (resolve: Function, reject: Function) => {
      try {

        if(!this._check_if_password_type(field)) {
          throw new Error(`Field ${field} is not of type PASSWORD.`)
        }

        const check: any = await this._execute(`{
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

  /**
   * _generate_methods
   * 
   * @returns void
   */
  private _generate_methods(): void {
    Object.keys(methods).forEach(_method => {
      Model.prototype[_method] = function(field: string, value: any = null, params: any = null): Promise<any> {
        return this._method(_method, field, value, params);
      }
    });
  }

  /**
   * _execute
   * @param query {string}
   * 
   * @returns Promise<new>
   */
  private _execute(query: string): Promise<any> {
    return new Promise(async (resolve: Function, reject: Function) => {
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

  /**
   * _method
   * @param type {string}
   * @param field {any}
   * @param value {any}
   * @param params {any}
   * 
   * @returns Promise<new>
   */
  private async _method(type: string, field: any, value: any = null, params: any = null): Promise<any> {        
    if(type === methods.uid || type === methods.has) {
      params = value;
      value = field;
    }

    params = this._validate(this.schema.original, params);
    
    const query = new Query(type, field, value, params, this.schema.name, this._logger);

    return this._execute(query.query);
  }

  /**
   * query
   * @param query {string}
   * 
   * @returns Promise<new>
   */
  async query(query: string): Promise<any> {
    return new Promise(async (resolve: Function, reject: Function) => {
      const _txn: Txn = this.connection.client.newTxn();

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

  /**
   * queryWithVars
   * @param params {QueryParams}
   * 
   * @returns Promise<new> 
   */
  async queryWithVars(params: QueryParams): Promise<any> {
    return new Promise(async (resolve: Function, reject: Function) => {
      const _txn: Txn = this.connection.client.newTxn();

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

  /**
   * _is_relation
   * @param _key {string}
   * 
   * @returns boolean
   */
  private _is_relation(_key: string): boolean {
    const _field = this.schema.original[_key];

    if(typeof _field !== 'undefined' && typeof _field !== 'string' && _field.type === 'uid') {
      return true;
    }

    return false;
  }

  /**
   * _parse_mutation
   * @param mutation {any} 
   * @param name {string}
   * 
   * @returns {[index: string]: any}
   */
  private _parse_mutation(mutation: any, name: string): {[index: string]: any} {
    let _mutation: {[index: string]: any} = {};

    Object.keys(mutation).forEach(_key => {
      if(this._is_relation(_key)) {
        if(Array.isArray(mutation[_key])) {
          const _m: any = [];
          mutation[_key].forEach((_uid: any ) => {
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

  /**
   * _create
   * @param mutation {any}
   * 
   * @returns Promise<any> 
   */
  private _create(mutation: any): Promise<any> {
    return new Promise(async (resolve: Function, reject: Function) => {
      const _txn = this.connection.client.newTxn();

      try {
        const mu: Mutation = new this.connection.dgraph.Mutation();
        mu.setSetJson(mutation);

        const _unique_check = await this._check_unique_values(mutation, _txn);

        if(_unique_check) {
          await _txn.discard();
          return reject(new Error(`[Unique Constraint]: ${_unique_check}`));
        }

        mu.setCommitNow(true);
        mu.setIgnoreIndexConflict(true);
        
        const _mutation: any  = await _txn.mutate(mu);

        const _uid: any = _mutation.wrappers_[1].get('blank-0');
        const data: any = await this._method('uid', _uid);

        return resolve(data[0]);
      } catch (error) {
        await _txn.discard();
        return reject(error);
      } finally {
        await _txn.discard();
      }
    });
  }

  /**
   * create
   * @param data {any}
   * 
   * @returns Promise<any>
   */
  async create(data: any): Promise<any> {
    this._check_attributes(this.schema.original, Object.keys(data));
    const mutation = this._parse_mutation(data, this.schema.name);
    return this._create(mutation);
  }

  /**
   * _update
   * @param mutation {any}
   * @param uid {any}
   * 
   * @returns Promise<any>
   */
  private _update(mutation: any, uid: any): Promise<any> {
    return new Promise(async (resolve: Function, reject: Function) => {
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

  /**
   * update
   * @param data {any}
   * @param uid {any}
   * 
   * @returns Promise<any>
   */
  async update(data: any, uid: any): Promise<any> {

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

      const _filter: {[index: string]: any} = {};

      if(_keys.length > 0) {
        _keys.forEach(_key => {
          _filter[_key] = {
            $eq: uid[_key]
          }
        });
      }
      
      const data: any = await this._method('eq', _first, uid[_first], {
        filter: _filter
      });

      if(data.length > 0) {
        this._update(mutation, data[0].uid);
      }
    }
  }

  /**
   * _delete
   * @param mutation {any}
   * 
   * @returns Promise<any>
   */
  private _delete(mutation: any): Promise<any> {
    return new Promise(async (resolve: Function, reject: Function) => {
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

  /**
   * delete 
   * @param params {any}
   * @param uid {any}
   * 
   * @returns Promise<any>
   */
  async delete(params: any, uid: any = null): Promise<any> {

    if(!uid) {
      if(typeof params === 'string') {
        return this._delete({
          uid: params
        });
      }
  
      if(Array.isArray(params)) {
        const _uids = [];
        for(let _uid of params) {
          _uids.push({
            uid: _uid
          });
        }
  
        return this._delete(_uids);
      }

      if(typeof params === 'object') {

        const _fields = Object.keys(params);

        const _data: any = await this._method('has', _fields[0], {
          attributes: ['uid'],
          filter: params
        });

        if(_data.length === 0) {
          return;
        }

        return this.delete(pluck(_data, 'uid'));
      }
    }else {
      let _params: {[index: string]: any} = {};

      this._check_attributes(this.schema.original, Object.keys(params), true);

      for(let _key of Object.keys(params)) {
        if(this._is_relation(_key)) {
          if(Array.isArray(params[_key])) {
            const _a: {[index: string]: any} = [];
            params[_key].forEach((_uid: any ) => {
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
        const _p: any = [];
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

  /**
   * _get_unique_fields
   * 
   * @returns Array<string>
   */
  private _get_unique_fields(): Array<string> {
    const _unique: Array<string> = [];

    Object.keys(this.schema.original).forEach(_key => {
      const _param: string | FieldProps = this.schema.original[_key];
      if(typeof _param !== 'string' && _param.unique) {
        _unique.push(_key);
      }
    });

    return _unique;
  }

  /**
   * _check_unique_values
   * @param mutation {any}
   * @param _txn {any}
   * 
   * @returns Promise<any>
   */
  private async _check_unique_values(mutation: any, _txn: any): Promise<any> {
    return new Promise(async (resolve: Function, reject: Function) => {
      const _unique = this._get_unique_fields();

      if(_unique.length === 0) {
        return resolve(false);
      }

      for(let _key of _unique) {
        let _mvalue: string = mutation[`${this.schema.name}.${_key}`];
        let _param: string | FieldProps = this.schema.original[_key];
        if(typeof _param !== 'string' && _param.type === 'string') {
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

  /**
   * _check_attributes
   * @param original {any}
   * @param attributes {any}
   * @param isUpdate {boolean}
   * 
   * @returs void 
   */
  private _check_attributes(original: any, attributes: any, isUpdate: boolean = false): void {
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

  /**
   * _all_attributes
   * @param original {any}
   * 
   * @return Array<string>
   */
  private _all_attributes(original: any): Array<string> {
    const _attrs: Array<string> = [];
    for(let attr of Object.keys(original)) {
      if(original[attr].type === 'uid' || original[attr] === 'password' || original[attr].type === 'password') {
        continue;
      }
      _attrs.push(attr);
    }

    return _attrs;
  }
 
  /**
   * _validate
   * @param original {any} 
   * @param params {any}
   * 
   * @returns Params
   */
  private _validate(original:any , params: Params = {}): Params {
    
    if(!params) {
      params = {};
    }

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

        this._validate(this._models[original[relation].model], params.include[relation]);
      }
    }

    return params;
  }
}

export default Model;
