"use strict";
/**
 * Query
 *
 * dgraph-orm Query class
 *
 * @author Ashok Vishwakarma <akvlko@gmail.com>
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * methods
 *
 * dgraph-orm model methods
 */
var methods_1 = __importDefault(require("./helpers/methods"));
/**
 * _conditions
 *
 * @type Array<string>
 */
var _conditions = ['$or', '$and'];
/**
 * Query
 *
 * Class Query
 */
var Query = /** @class */ (function () {
    /**
     * constructor
     * @param type {string}
     * @param field {string}
     * @param value {any}
     * @param params {Params}
     * @param name {string}
     * @param logger {Function}
     */
    function Query(type, field, value, params, name, logger) {
        this.name = name;
        this.params = params;
        this.type = type;
        this.field = field;
        this.value = value;
        this.logger = logger;
        this.where = this._where(this.type, this.field, this.value, this.name);
        this.query = this._build(this.params);
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
    Query.prototype._where = function (type, field, value, name) {
        var _where = '';
        switch (type) {
            case methods_1.default.eq:
            case methods_1.default.allofterms:
            case methods_1.default.alloftext:
            case methods_1.default.anyofterms:
            case methods_1.default.anyoftext:
                _where = "(func: " + type + "(" + name + "." + field + ", " + ('"' + value + '"') + "){{ORDER}}{{LIMIT}})";
                break;
            case methods_1.default.regexp:
                _where = "(func: " + type + "(" + name + "." + field + ", " + value + "){{ORDER}}{{LIMIT}})";
                break;
            case methods_1.default.uid:
                if (Array.isArray(field)) {
                    field = field.join(', ');
                }
                _where = "(func: " + methods_1.default.uid + "(" + field + "){{ORDER}}{{LIMIT}})";
                break;
            case methods_1.default.has:
                _where = "(func: " + methods_1.default.has + "(" + name + "." + field + "){{ORDER}}{{LIMIT}})";
                break;
            case methods_1.default.near:
                _where = "(func: " + methods_1.default.near + "(" + name + "." + field + ", [" + value.longitude + ", " + value.latitude + "], " + value.distance + "){{ORDER}}{{LIMIT}})";
                break;
            case methods_1.default.contains:
                _where = "(func: " + methods_1.default.contains + "(" + name + "." + field + ", [" + value.longitude + ", " + value.latitude + "]){{ORDER}}{{LIMIT}})";
                break;
        }
        return _where;
    };
    /**
     * _filter
     * @param key {string}
     * @param value {any}
     * @param name {string}
     *
     * @returns string
     */
    Query.prototype._filter = function (key, value, name) {
        if (key.toLowerCase() === '$has') {
            return key.replace('$', '') + "(" + name + "." + value + ")";
        }
        if (typeof value === 'string') {
            return "eq(" + name + "." + key + ", \"" + value + "\")";
        }
        if (typeof value === 'object' && !Array.isArray(value)) {
            var _key = Object.keys(value)[0];
            if (_key) {
                var _value = value[_key];
                if (Array.isArray(_value)) {
                    var _sub_1 = [];
                    _value.forEach(function (_val) {
                        _sub_1.push("uid_in(" + name + "." + key + ", " + _val + ")");
                    });
                    return _sub_1.join(' OR ');
                }
                if (typeof _value === 'string' && _key !== '$regexp') {
                    _value = '"' + _value + '"';
                }
                if (_key === '$ne') {
                    return "NOT eq(" + name + "." + key + ", " + _value + ")";
                }
                return _key.replace('$', '') + "(" + name + "." + key + ", " + _value + ")";
            }
        }
    };
    /**
     * _parse_filter
     * @param filter {any}
     * @param name {string}
     *
     * @returns string
     */
    Query.prototype._parse_filter = function (filter, name) {
        var _this = this;
        var _filters = [];
        if (typeof filter !== 'undefined') {
            Object.keys(filter).forEach(function (_key) {
                if (_conditions.indexOf(_key.toLowerCase()) === -1) {
                    _filters.push(_this._filter(_key, filter[_key], name));
                }
                else {
                    var _sub_2 = [];
                    Object.keys(filter[_key]).forEach(function (_k) {
                        if (Array.isArray(filter[_key][_k])) {
                            filter[_key][_k].forEach(function (_val) {
                                _sub_2.push(_this._filter(_k, _val, name));
                            });
                        }
                        else {
                            _sub_2.push(_this._filter(_k, filter[_key][_k], name));
                        }
                    });
                    if (_sub_2.length > 0) {
                        _filters.push("(" + _sub_2.join(" " + _key.replace('$', '').toUpperCase() + " ") + ")");
                    }
                }
            });
        }
        if (_filters.length > 0) {
            return " @filter(" + _filters.join(' AND ') + ")";
        }
        return '';
    };
    /**
     * _attributes
     * @param attributes {Array<string>}
     * @param name {string}
     *
     * @return string
     */
    Query.prototype._attributes = function (attributes, name) {
        var _attrs = [];
        for (var _i = 0, attributes_1 = attributes; _i < attributes_1.length; _i++) {
            var attr = attributes_1[_i];
            if (attr === 'uid') {
                _attrs.push('uid');
            }
            else {
                _attrs.push(attr + ": " + name + "." + attr);
            }
        }
        return _attrs.join('\n');
    };
    /**
     * _include
     * @param include {Include}
     *
     * @returns string
     */
    Query.prototype._include = function (include, name) {
        if (name === void 0) { name = this.name; }
        var _inc = '';
        if (!include) {
            return _inc;
        }
        for (var _i = 0, _a = Object.keys(include); _i < _a.length; _i++) {
            var relation = _a[_i];
            if (include[relation].count) {
                _inc += (include[relation].as ? include[relation].as : relation) + ": count(" + name + "." + relation + ")";
                continue;
            }
            _inc += (include[relation].as ? include[relation].as : relation) + ": " + name + "." + relation;
            var _limit = this._extras(include[relation]);
            var _order = this._parse_order(include[relation].order);
            if (include[relation].filter) {
                _inc += "" + this._parse_filter(include[relation].filter, include[relation].model);
            }
            if (_limit) {
                _inc += " (" + _limit + ") ";
            }
            if (_order) {
                _inc += " (" + _order + ")";
            }
            _inc += "{\n        " + this._attributes(include[relation].attributes, include[relation].model) + "\n        " + this._include(include[relation].include, include[relation].model) + "\n      }";
        }
        return _inc;
    };
    /**
     * _extra
     * @param params {Params}
     *
     * @return string
     */
    Query.prototype._extras = function (params) {
        var _extra = [];
        if (params.first && typeof params.first === 'number') {
            _extra.push("first: " + params.first);
        }
        if (params.offset && typeof params.offset === 'number') {
            _extra.push("offset: " + params.offset);
        }
        if (params.after) {
            _extra.push("after: " + params.after);
        }
        if (_extra.length > 0) {
            return "" + _extra.join(', ');
        }
        return '';
    };
    /**
     * _parse_order
     * @param order {Array<string>}
     *
     * @returns string
     */
    Query.prototype._parse_order = function (order) {
        var _this = this;
        var _order = [];
        if (order && order.length > 0) {
            if (Array.isArray(order[0])) {
                order.forEach(function (_o) {
                    if (typeof _o[1] !== 'undefined') {
                        _order.push("order" + _o[1].toLowerCase() + ": " + _this.name + "." + _o[0]);
                    }
                });
            }
            else {
                _order.push("order" + order[1].toLowerCase() + ": " + this.name + "." + order[0]);
            }
        }
        if (_order.length > 0) {
            return "" + _order.join(', ');
        }
        return '';
    };
    /**
     * _build
     * @param params {any}
     *
     * @returns string
     */
    Query.prototype._build = function (params) {
        var _order = this._parse_order(params.order);
        var _limit = this._extras(params);
        if (_order) {
            _order = ", " + _order;
        }
        if (_limit) {
            _limit = ", " + _limit;
        }
        var query = "{\n      " + this.name + " " + this.where.replace('{{ORDER}}', _order).replace('{{LIMIT}}', _limit) + " " + this._parse_filter(params.filter, this.name) + " {\n        " + this._attributes(params.attributes, this.name) + "\n        " + this._include(params.include) + "\n      }\n    }";
        this.logger(query);
        return query;
    };
    return Query;
}());
exports.default = Query;
//# sourceMappingURL=query.js.map