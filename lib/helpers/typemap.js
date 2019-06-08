"use strict";
/**
 * typemap
 *
 * dgraph-orm type map
 *
 * @author Ashok Vishwakarma <akvlko@gmail.com>
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var types_1 = __importDefault(require("./types"));
var typemap = {};
typemap[types_1.default.STRING] = ['list', 'count', 'lang', 'index', 'upsert', 'token', 'unique'];
typemap[types_1.default.INT] = ['list', 'count', 'index', 'upsert', 'unique'];
typemap[types_1.default.FLOAT] = ['list', 'count', 'index', 'upsert', 'unique'];
typemap[types_1.default.BOOL] = ['list', 'count', 'index', 'upsert'];
typemap[types_1.default.DATETIME] = ['list', 'count', 'index', 'upsert', 'token'];
typemap[types_1.default.GEO] = ['list', 'count', 'index', 'upsert'];
typemap[types_1.default.PASSWORD] = [];
typemap[types_1.default.UID] = ['count', 'reverse', 'model', 'replace'];
exports.default = typemap;
//# sourceMappingURL=typemap.js.map