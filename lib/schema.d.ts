/**
 * Schema
 *
 * dgraph-orm Schema class
 *
 * @author Ashok Vishwakarma <akvlko@gmail.com>
 */
import { SchemaFields } from './types';
/**
 * Schema
 *
 * Schema class
 */
declare class Schema {
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
    constructor(name: string, original: SchemaFields);
    /**
     * _build
     * @param name {string}
     * @param params {string | FieldProps}
     *
     * @returns string
     */
    private _build;
    /**
     * _generate
     * @param name {string}
     * @param original {SchemaFields}
     *
     * @returns Array<string>
     */
    private _generate;
}
export default Schema;
