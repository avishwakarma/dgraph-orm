/**
 * utility
 *
 * dgraph-orm utilities
 *
 * @author Ashok Vishwakarma <akvlko@gmail.com>
 */
import { FieldProps } from '../types';
/**
 * checkOptions
 * @param name {string}
 * @param options {string | FieldProps}
 *
 * @returns void
 */
export declare const checkOptions: (name: string, options: string | FieldProps) => void;
/**
 * prepareSchema
 * @param name {string}
 * @param options {string | FieldProps}
 *
 * @returns string
 */
export declare const prepareSchema: (name: string, options: string | FieldProps) => string;
/**
 * pluck
 * @param arr Array<any>
 * @param key string
 *
 * @returns Array<string>
 */
export declare const pluck: (arr: any[], key: string) => any[];
/**
 * merge
 *
 * @param data {any}
 * @param keys {Array<string>}
 *
 * @returns any
 */
export declare const merge: Function;
