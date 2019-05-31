"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utility_1 = require("./helpers/utility");
var Schema = /** @class */ (function () {
    function Schema(name, schema) {
        this.schema = this._generate(name, schema);
        this.name = name;
        this.original = schema;
    }
    Schema.prototype._build = function (name, params) {
        utility_1.checkOptions(name, params);
        return utility_1.prepareSchema(name, params);
    };
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