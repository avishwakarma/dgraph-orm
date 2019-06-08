"use strict";
/**
 * utility
 *
 * dgraph-orm utilities
 *
 * @author Ashok Vishwakarma <akvlko@gmail.com>
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var types_1 = __importDefault(require("./types"));
var typemap_1 = __importDefault(require("./typemap"));
var tokenmap_1 = __importDefault(require("./tokenmap"));
/**
 * checkOptions
 * @param name {string}
 * @param options {string | FieldProps}
 *
 * @returns void
 */
exports.checkOptions = function (name, options) {
    Object.keys(options).forEach(function (key) {
        if (key === 'type' || typeof options === 'string')
            return;
        if (typemap_1.default[options.type].indexOf(key) === -1) {
            throw new Error('[Type Error]: In ' + name + ' of type ' + options.type.toUpperCase() + ', ' + key + ' is not allowed.');
        }
    });
    if (typeof options === 'string') {
        return;
    }
    if (options.type === types_1.default.UID && !options.model) {
        throw new Error('[Type Error]: In ' + name + ' of type ' + options.type.toUpperCase() + ', model is required.');
    }
    if (options.count && (options.type !== types_1.default.UID && !options.list)) {
        throw new Error('[Type Error]: In ' + name + ' of type ' + options.type.toUpperCase() + ', count requires list.');
    }
    if (!options.index && options.token) {
        throw new Error('[Type Error]: In ' + name + ' of type ' + options.type.toUpperCase() + ', token requires index.');
    }
    if (!options.token && options.index && (options.type === types_1.default.DATETIME || options.type === types_1.default.STRING)) {
        throw new Error('[Type Error]: In ' + name + ' of type ' + options.type.toUpperCase() + ', index requires token.');
    }
    if (options.type === types_1.default.DATETIME && options.index && typeof options.token !== 'string') {
        throw new Error('[Type Error]: In ' + name + ' of type ' + options.type.toUpperCase() + ', token must be a string.');
    }
    if (options.type === types_1.default.DATETIME && options.index && typeof options.token === 'string' && tokenmap_1.default[types_1.default.DATETIME].indexOf(options.token) === -1) {
        throw new Error('[Type Error]: In ' + name + ' of type ' + options.type.toUpperCase() + ', token must be any one of ' + tokenmap_1.default[types_1.default.DATETIME].join(', ') + '.');
    }
    if (options.token && typeof options.token !== 'string' && options.type !== types_1.default.DATETIME) {
        if (options.token.exact && options.token.hash) {
            throw new Error('[Type Error]: In ' + name + ' of type ' + options.type.toUpperCase() + ', exact and hash index types shouldn\'t be used together.');
        }
        if (options.token.exact && options.token.term) {
            throw new Error('[Type Error]: In ' + name + ' of type ' + options.type.toUpperCase() + ', exact or hash index types shouldn\'t be used alongside the term index type.');
        }
        if (options.token.hash && options.token.term) {
            throw new Error('[Type Error]: In ' + name + ' of type ' + options.type.toUpperCase() + ', exact or hash index types shouldn\'t be used alongside the term index type.');
        }
        Object.keys(options.token).forEach(function (key) {
            if (tokenmap_1.default[options.type].indexOf(key) === -1) {
                throw new Error('[Type Error]: In ' + name + ' of type ' + options.type.toUpperCase() + ', for token only ' + tokenmap_1.default[options.type].join(', ') + ' are allowd.');
            }
        });
    }
};
/**
 * prepareSchema
 * @param name {string}
 * @param options {string | FieldProps}
 *
 * @returns string
 */
exports.prepareSchema = function (name, options) {
    if (typeof options === 'string') {
        return name + ': ' + options + ' .';
    }
    var schema = options.type + ' ';
    if (options.list) {
        schema = '[' + schema + '] ';
    }
    if (options.index) {
        if (options.type !== types_1.default.STRING && options.type !== types_1.default.DATETIME) {
            schema += ' @index(' + options.type + ') ';
        }
        else if (options.type === types_1.default.DATETIME) {
            schema += ' @index(' + options.token + ') ';
        }
        else {
            schema += ' @index(' + Object.keys(options.token).join(', ') + ') ';
        }
    }
    Object.keys(options).forEach(function (key) {
        if (key === 'type' || key === 'list' || key === 'index' || key === 'token' || key === 'model' || key === 'unique') {
            return;
        }
        schema += '@' + key + ' ';
    });
    return name + ': ' + schema + '.';
};
/**
 * pluck
 * @param arr Array<any>
 * @param key string
 *
 * @returns Array<string>
 */
exports.pluck = function (arr, key) {
    var _data = [];
    if (!Array.isArray(arr)) {
        return [];
    }
    for (var _i = 0, arr_1 = arr; _i < arr_1.length; _i++) {
        var obj = arr_1[_i];
        if (typeof obj === 'object' && typeof obj[key] !== 'undefined') {
            _data.push(obj[key]);
        }
    }
    return _data;
};
/**
 * merge
 *
 * @param data {any}
 * @param keys {Array<string>}
 *
 * @returns any
 */
exports.merge = function (data, keys) {
    if (keys.length === 1 && typeof data[keys[0]] !== 'undefined') {
        return data[keys[0]];
    }
    var _data = {};
    keys.forEach(function (_key) {
        if (typeof data[_key] !== 'undefined') {
            _data[_key] = data[_key];
        }
    });
    return _data;
};
//# sourceMappingURL=utility.js.map