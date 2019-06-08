"use strict";
/**
 * dgraph-orm
 *
 * Simplified schema creation, queries and mutations for Dgraph.
 *
 * @author Ashok Vishwakarma <akvlko@gmail.com>
 *
 * @uses npm install dgraph-orm
 * @docs https://ashokvishwakarma.github.io/dgraph-orm
 *
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Schema
 *
 * dgraph-orm Schema class
 */
var schema_1 = __importDefault(require("./schema"));
/**
 * Types
 *
 * dgraph-orm feilds Types
 */
var types_1 = __importDefault(require("./helpers/types"));
/**
 * Connection
 *
 * dgraph-orm Connection class
 */
var connection_1 = __importDefault(require("./connection"));
/**
 * Model
 *
 * dgraph-orm Model class
 */
var model_1 = __importDefault(require("./model"));
/**
 * DgraphORM
 *
 * DgraphORM class
 */
var DgraphORM = /** @class */ (function () {
    /**
     * contructor
     */
    function DgraphORM() {
        /**
         * _logger
         *
         * @type Function
         * Methods for logging
         */
        this._logger = function () { };
        /**
         * _models
         *
         * @type any
         * created models
         */
        this.models = {};
        /**
         * Types
         *
         * @type TypesType
         * Field types for dagraph-orm
         */
        this.Types = types_1.default;
        /**
         * Schema
         *
         * @type {new(name: string, schema: SchemaFields): Schema}
         *
         * Schema class
         */
        this.Schema = schema_1.default;
        this.connection = this._create_connection();
    }
    /**
     * disconnect
     *
     * @returns void
     *
     * disconnect the dgraph connection
     */
    DgraphORM.prototype.disconnect = function () {
        this.connection.close();
    };
    /**
     * logging
     * @param callback {Function}
     *
     * @returns void
     */
    DgraphORM.prototype.logging = function (callback) {
        this._logger = callback;
    };
    /**
     * _log
     *
     * @param message {string}
     *
     * @returns void
     */
    DgraphORM.prototype._log = function (message) {
        this._logger(message);
    };
    /**
     * _set_model
     *
     * @param schema {Schema}
     *
     * @returns void
     */
    DgraphORM.prototype._set_model = function (schema) {
        if (schema.name && typeof this.models[schema.name] === 'undefined') {
            this.models[schema.name] = schema.original;
            this._generate_schema(schema.schema);
        }
    };
    /**
     * _generate_schema
     *
     * @param schema {Array<string>}
     *
     * @returns void
     */
    DgraphORM.prototype._generate_schema = function (schema) {
        return __awaiter(this, void 0, void 0, function () {
            var op;
            return __generator(this, function (_a) {
                op = new this.connection.dgraph.Operation();
                op.setSchema(schema.join("\n"));
                this.connection.client.alter(op).catch(function (error) { });
                return [2 /*return*/];
            });
        });
    };
    /**
     * _create_connection
     *
     * @param config {ConnectionConfig}
     *
     * @returns Connection
     */
    DgraphORM.prototype._create_connection = function (config) {
        if (config === void 0) { config = null; }
        return new connection_1.default(config, this._log.bind(this));
    };
    /**
     * model
     *
     * @param schema {Schema}
     *
     * @returns Model
     */
    DgraphORM.prototype.model = function (schema) {
        this._set_model(schema);
        return new model_1.default(schema, this.models, this.connection, this._log.bind(this));
    };
    /**
     * connect
     *
     * @param config {ConnectionConfig}
     *
     * @returns void
     */
    DgraphORM.prototype.connect = function (config) {
        this.connection = this._create_connection(config);
    };
    /**
     * query
     *
     * @param params {QueryParams}
     *
     * @returns Promise<any>
     */
    DgraphORM.prototype.query = function (params) {
        return this.connection.client
            .newTxn()
            .queryWithVars(params.query, params.variables);
    };
    /**
     * mutate
     *
     * @param mutation {string}
     *
     * @returns Promise<any>
     */
    DgraphORM.prototype.mutate = function (mutation) {
        var mu = new this.connection.dgraph.Mutation();
        mu.setSetJson(mutation);
        return this.connection.client.newTxn()
            .mutate(mu);
    };
    return DgraphORM;
}());
exports.default = new DgraphORM();
//# sourceMappingURL=index.js.map