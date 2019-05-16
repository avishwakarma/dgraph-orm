"use strict";
exports.__esModule = true;
var types_1 = require("./types");
var typemap_1 = require("./typemap");
var tokenmap_1 = require("./tokenmap");
function checkOptions(name, options) {
    Object.keys(options).forEach(function (key, index) {
        if (key === 'type' || typeof options === 'string')
            return;
        if (typemap_1["default"][options.type].indexOf(key) === -1) {
            throw new Error('[Type Error]: In ' + name + ' of type ' + options.type.toUpperCase() + ', ' + key + ' is not allowed.');
        }
    });
    if (typeof options === 'string') {
        return;
    }
    if (options.type === types_1["default"].UID && !options.model) {
        throw new Error('[Type Error]: In ' + name + ' of type ' + options.type.toUpperCase() + ', model is required.');
    }
    if (options.count && (options.type !== types_1["default"].UID && !options.list)) {
        throw new Error('[Type Error]: In ' + name + ' of type ' + options.type.toUpperCase() + ', count requires list.');
    }
    if (!options.index && options.token) {
        throw new Error('[Type Error]: In ' + name + ' of type ' + options.type.toUpperCase() + ', token requires index.');
    }
    if (!options.token && options.index && (options.type === types_1["default"].DATETIME || options.type === types_1["default"].STRING)) {
        throw new Error('[Type Error]: In ' + name + ' of type ' + options.type.toUpperCase() + ', index requires token.');
    }
    if (options.type === types_1["default"].DATETIME && options.index && typeof options.token !== 'string') {
        throw new Error('[Type Error]: In ' + name + ' of type ' + options.type.toUpperCase() + ', token must be a string.');
    }
    if (options.type === types_1["default"].DATETIME && options.index && tokenmap_1["default"][types_1["default"].DATETIME].indexOf(options.token) === -1) {
        throw new Error('[Type Error]: In ' + name + ' of type ' + options.type.toUpperCase() + ', token must be any one of ' + tokenmap_1["default"][types_1["default"].DATETIME].join(', ') + '.');
    }
    if (options.token && options.type !== types_1["default"].DATETIME) {
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
            if (tokenmap_1["default"][options.type].indexOf(key) === -1) {
                throw new Error('[Type Error]: In ' + name + ' of type ' + options.type.toUpperCase() + ', for token only ' + tokenmap_1["default"][options.type].join(', ') + ' are allowd.');
            }
        });
    }
}
exports.checkOptions = checkOptions;
function prepareSchema(name, options) {
    if (typeof options === 'string') {
        return name + ': ' + options + ' .';
    }
    var schema = options.type + ' ';
    if (options.list) {
        schema = '[' + schema + '] ';
    }
    if (options.index) {
        if (options.type !== types_1["default"].STRING && options.type !== types_1["default"].DATETIME) {
            schema += ' @index(' + options.type + ') ';
        }
        else if (options.type === types_1["default"].DATETIME) {
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
}
exports.prepareSchema = prepareSchema;
function pluck(arr, key) {
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
}
exports.pluck = pluck;
