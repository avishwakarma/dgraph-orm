"use strict";
/**
 * Schema
 *
 * dgraph-orm Schema class
 *
 * @author Ashok Vishwakarma <akvlko@gmail.com>
 */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * helper utilities
 */
var utility_1 = require("./helpers/utility");
/**
 * Schema
 *
 * Schema class
 */
var Schema = /** @class */ (function () {
    /**
     *
     * @param name {string}
     * @param schema {SchemaFields}
     */
    function Schema(name, original) {
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
    Schema.prototype._build = function (name, params) {
        utility_1.checkOptions(name, params);
        return utility_1.prepareSchema(name, params);
    };
    /**
     * _generate
     * @param name {string}
     * @param original {SchemaFields}
     *
     * @returns Array<string>
     */
    Schema.prototype._generate = function (name, original) {
        var _this = this;
        var _schema = [];
        Object.keys(original).forEach(function (key) {
            _schema.push(name + '.' + _this._build(key, original[key]));
        });
        return _schema;
    };
    return Schema;
}());
exports.default = Schema;
//# sourceMappingURL=schema.js.map