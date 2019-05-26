"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utility_1 = require("./helpers/utility");
var Schema = /** @class */ (function () {
    function Schema(name, schema) {
        this._schema = [];
        this._generate(name, schema);
        this.name = name;
        this.schema = this._schema;
        this.original = schema;
    }
    Schema.prototype._build = function (name, params) {
        utility_1.checkOptions(name, params);
        return utility_1.prepareSchema(name, params);
    };
    Schema.prototype._generate = function (name, original) {
        var _this = this;
        Object.keys(original).forEach(function (key) {
            _this._schema.push(name + '.' + _this._build(key, original[key]));
        });
    };
    return Schema;
}());
exports.default = Schema;
//# sourceMappingURL=schema.js.map