/**
 * Schema
 * 
 * dgraph-orm Schema class
 * 
 * @author Ashok Vishwakarma <akvlko@gmail.com>
 */

/**
 * helper utilities
 */
import { prepareSchema, checkOptions } from './helpers/utility';

import { SchemaFields, FieldProps } from './types';

/**
 * Schema
 * 
 * Schema class
 */
class Schema {

  /**
   * name
   * 
   * @type string
   */
  name: string;

  /**
   * schema
   * 
   * @type Array<string>
   */
  schema: Array<string>;

  /**
   * original
   * 
   * @type SchemaFields
   */
  original: SchemaFields;
  
  /**
   * 
   * @param name {string}
   * @param schema {SchemaFields}
   */
  constructor(name: string, original: SchemaFields) {
    this.name = name;
    this.original = original;

    this.schema = this._generate(name, original);
  }

  /**
   * _build
   * @param name {string} 
   * @param params {string | FieldProps}
   * 
   * @returns string
   */
  private _build(name: string, params: string | FieldProps): string {
    checkOptions(name, params);
    return prepareSchema(name, params);
  }

  /**
   * _generate
   * @param name {string}
   * @param original {SchemaFields}
   * 
   * @returns Array<string>
   */
  private _generate(name: string, original: SchemaFields): Array<string> {
    const _schema: Array<string> = [];
    Object.keys(original).forEach((key: string) => {
      _schema.push(name + '.' + this._build(key, original[key]));
    });

    return _schema;
  }
}

export default Schema;