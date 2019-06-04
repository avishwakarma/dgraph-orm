
/**
 * Query
 * 
 * dgraph-orm Query class
 * 
 * @author Ashok Vishwakarma <akvlko@gmail.com>
 */

/**
 * methods
 * 
 * dgraph-orm model methods
 */
import methods from './helpers/methods';

import { Params, Include } from './types';

/**
 * _conditions
 * 
 * @type Array<string>
 */
const _conditions: Array<string> = ['$or', '$and'];

/**
 * Query
 * 
 * Class Query
 */
class Query {

  /**
   * name
   * 
   * @type string
   */
  private name: string;

  /**
   * params
   * 
   * @type Params
   */
  private params: Params;

  /**
   * type
   * 
   * @type string
   */
  private type: string;

  /**
   * field
   * 
   * @type string
   */
  private field: string;

  /**
   * value
   * 
   * @type any
   */
  private value: any;

  /**
   * logger
   * 
   * @type Function
   */
  private logger: Function;

  /**
   * where
   * 
   * @type any
   */
  private where: any;

  /**
   * query
   * 
   * @type string
   */
  query: string;

  /**
   * constructor
   * @param type {string}
   * @param field {string}
   * @param value {any}
   * @param params {Params}
   * @param name {string}
   * @param logger {Function}
   */
  constructor(type: string, field: string, value: any, params: Params, name: string, logger: Function) {
    this.name = name;
    this.params = params;
    this.type = type;
    this.field = field;
    this.value = value;
    this.logger = logger;
    this.where = this._where(this.type, this.field, this.value, this.name);
    this.query = this._build(this.params)
  }

  /**
   * _where
   * @param type {string} 
   * @param field {string}
   * @param value {any}
   * @param name {string}
   * 
   * @returns string
   */
  private _where(type: string, field: string, value: any, name: string): string {
    let _where = '';

    switch (type) {
      case methods.eq:
      case methods.allofterms:
      case methods.alloftext:
      case methods.anyofterms:
      case methods.anyoftext:
        _where = `(func: ${type}(${name}.${field}, ${'"' + value + '"'}){{ORDER}}{{LIMIT}})`;
      break;

      case methods.regexp:
        _where = `(func: ${type}(${name}.${field}, ${value}){{ORDER}}{{LIMIT}})`;
      break;

      case methods.uid:
        if(Array.isArray(field)) {
          field = field.join(', ');
        }
        _where = `(func: ${methods.uid}(${field}){{ORDER}}{{LIMIT}})`;
      break;

      case methods.has:
        _where = `(func: ${methods.has}(${name}.${field}){{ORDER}}{{LIMIT}})`;
      break;

      case methods.near:
        _where = `(func: ${methods.near}(${name}.${field}, [${value.longitude}, ${value.latitude}], ${value.distance}){{ORDER}}{{LIMIT}})`;
      break;

      case methods.contains:
        _where = `(func: ${methods.contains}(${name}.${field}, [${value.longitude}, ${value.latitude}]){{ORDER}}{{LIMIT}})`;
      break;
      
    }

    return _where;
  }

  /**
   * _filter
   * @param key {string} 
   * @param value {any}
   * @param name {string}
   * 
   * @returns string
   */
  private _filter(key: string, value: any, name: string): string {
    if(key.toLowerCase() === '$has') {
      return `${key.replace('$', '')}(${name}.${value})`;
    }

    if(typeof value === 'string') {
      return `eq(${name}.${key}, "${value}")`; 
    }

    if(typeof value === 'object' && !Array.isArray(value)) {
      const _key = Object.keys(value)[0];

      if(_key) {
        let _value = value[_key];
        
        if(Array.isArray(_value)) {
          const _sub: Array<string> = [];
          _value.forEach((_val: any) => {
            _sub.push(`uid_in(${name}.${key}, ${_val})`);
          });

          return _sub.join(' OR ');
        }
  
        if(typeof _value === 'string' && _key !== '$regexp') {
          _value = '"' + _value + '"';
        }

        if(_key === '$ne') {
          return `NOT eq(${name}.${key}, ${_value})`; 
        }

        return `${_key.replace('$', '')}(${name}.${key}, ${_value})`; 
      }
    }
  }

  /**
   * _parse_filter
   * @param filter {any} 
   * @param name {string}
   * 
   * @returns string
   */
  private _parse_filter(filter: any, name: string): string {

    const _filters: Array<any> = []

    if(typeof filter !== 'undefined') {
      Object.keys(filter).forEach(_key => {
        if(_conditions.indexOf(_key.toLowerCase()) === -1) {
          _filters.push(this._filter(_key, filter[_key], name));
        } else {
          const _sub: Array<string> = [];
          Object.keys(filter[_key]).forEach(_k => {
            if(Array.isArray(filter[_key][_k])) {
              filter[_key][_k].forEach((_val: any) => {
                _sub.push(this._filter(_k, _val, name));
              })
            }else {
              _sub.push(this._filter(_k, filter[_key][_k], name));
            }
          });

          if(_sub.length > 0) {
            _filters.push(`(${_sub.join(` ${_key.replace('$', '').toUpperCase()} `)})`);
          }
        }
      });
    }

    if(_filters.length > 0) {
      return ` @filter(${_filters.join(' AND ')})`;
    }

    return '';
  }

  /**
   * _attributes
   * @param attributes {Array<string>}
   * @param name {string}
   * 
   * @return string
   */
  private _attributes(attributes: Array<string>, name: string): string {
    const _attrs: Array<string> = [];
    for(let attr of attributes) {
      if(attr === 'uid') {
        _attrs.push('uid');
      }else {
        _attrs.push(`${attr}: ${name}.${attr}`);
      }
    }
    
    return _attrs.join('\n');
  }

  /**
   * _include
   * @param include {Include}
   * 
   * @returns string
   */
  private _include(include: Include): string {
    let _inc: string = '';

    if(!include) {
      return _inc;
    }

    for(let relation of Object.keys(include)) {
      if(include[relation].count) {
        _inc += `${include[relation].as ? include[relation].as : relation}: count(${this.name}.${relation})`;
        continue;
      }

      _inc += `${include[relation].as ? include[relation].as : relation}: ${this.name}.${relation}`;

      const _limit: string = this._extras(include[relation]);
      const _order: string = this._parse_order(include[relation].order);

      if(include[relation].filter) {
        _inc +=  `${this._parse_filter(include[relation].filter, include[relation].model)}`
      }

      if(_limit) {
        _inc += ` (${_limit}) `;
      }

      if(_order) {
        _inc += ` (${_order})`;
      }

      _inc += `{
        ${this._attributes(include[relation].attributes, include[relation].model)}
        ${this._include(include[relation].include)}
      }`
    }

    return _inc;
  }

  /**
   * _extra
   * @param params {Params}
   * 
   * @return string
   */
  private _extras(params: Params): string {
    let _extra = [];

    if(params.first && typeof params.first === 'number') {
      _extra.push(`first: ${params.first}`);
    }

    if(params.offset && typeof params.offset === 'number') {
      _extra.push(`offset: ${params.offset}`);
    }

    if(params.after) {
      _extra.push(`after: ${params.after}`);
    }

    if(_extra.length > 0) {
      return `${_extra.join(', ')}`;
    }

    return '';
  }

  /**
   * _parse_order
   * @param order {Array<string>}
   * 
   * @returns string 
   */
  private _parse_order(order: Array<any>): string {
    const _order: Array<string> = [];

    if(order && order.length > 0) {
      if(Array.isArray(order[0])) {
        order.forEach((_o: any) => {
          if(typeof _o[1] !== 'undefined') {
            _order.push(`order${_o[1].toLowerCase()}: ${this.name}.${_o[0]}`);
          }
        });
      }else {
        _order.push(`order${order[1].toLowerCase()}: ${this.name}.${order[0]}`);
      }
    }

    if(_order.length > 0) {
      return `${_order.join(', ')}`;
    }

    return '';
  }

  /**
   * _build
   * @param params {any}
   * 
   * @returns string
   */
  private _build(params: any): string {
    let _order: string = this._parse_order(params.order);
    let _limit: string = this._extras(params);

    if(_order) {
      _order = `, ${_order}`;
    }

    if(_limit) {
      _limit = `, ${_limit}`;
    }

    const query: string = `{
      ${this.name} ${this.where.replace('{{ORDER}}', _order).replace('{{LIMIT}}', _limit)} ${this._parse_filter(params.filter, this.name)} {
        ${this._attributes(params.attributes, this.name)}
        ${this._include(params.include)}
      }
    }`;

    this.logger(query);

    return query;
  }
}

export default Query;