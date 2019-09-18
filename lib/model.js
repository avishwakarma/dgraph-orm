"use strict";
/**
 * Model
 *
 * dgraph-orm Model class
 *
 * @author Ashok Vishwakarma <akvlko@gmail.com>
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
 * Query
 *
 * dgraph-orm Query class
 */
var query_1 = __importDefault(require("./query"));
/**
 * methods
 *
 * dgraph-orm model methods
 */
var methods_1 = __importDefault(require("./helpers/methods"));
/**
 * pluck
 *
 * pluck utility method
 */
var utility_1 = require("./helpers/utility");
var types_1 = __importDefault(require("./helpers/types"));
/**
 * Model
 *
 * Class Model
 */
var Model = /** @class */ (function () {
    /**
     * contructor
     * @param schema {Schema}
     * @param models {any}
     * @param connection {Connection}
     * @param logger {Function}
     */
    function Model(schema, models, connection, logger) {
        this.schema = schema;
        this._models = models;
        this.connection = connection;
        this._logger = logger;
        this._generate_methods();
    }
    Model.prototype.relation = function (uid, params) {
        return __awaiter(this, void 0, void 0, function () {
            var _include, _user, _data, _attributes_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!params.field || (Array.isArray(params.field) && params.field.length === 0)) {
                            return [2 /*return*/, null];
                        }
                        if (typeof params.field === 'string') {
                            params.field = [params.field];
                        }
                        this._check_attributes(this.schema.original, params.field, true, true);
                        _include = {};
                        params.field.map(function (_field) {
                            _include[_field] = {
                                as: _field
                            };
                        });
                        return [4 /*yield*/, this._method('uid', uid, {
                                include: _include
                            })];
                    case 1:
                        _user = _b.sent();
                        _data = null;
                        if (params.field.length === 1 && _user[0][params.field[0]] && _user[0][params.field[0]].length > 0) {
                            _attributes_1 = params.attributes && params.attributes[params.field[0]] ? params.attributes[params.field[0]] : ['uid'];
                            _data = _user[0][params.field[0]].map(function (_relation) {
                                return utility_1.merge(_relation, _attributes_1);
                            });
                        }
                        else {
                            _data = {};
                            params.field.forEach(function (_field) {
                                var _attributes = params.attributes && params.attributes[_field] ? params.attributes[_field] : ['uid'];
                                if (!_user[0][_field]) {
                                    _data[_field] = null;
                                }
                                else {
                                    _data[_field] = _user[0][_field].map(function (_relation) {
                                        return utility_1.merge(_relation, _attributes);
                                    });
                                }
                            });
                        }
                        return [2 /*return*/, new Promise(function (resolve) {
                                return resolve(_data);
                            })];
                }
            });
        });
    };
    /**
     * _check_if_password_type
     *
     * @param field {string}
     *
     * @returns boolean
     */
    Model.prototype._check_if_password_type = function (field) {
        var _field = this.schema.original[field];
        if (typeof _field === 'undefined') {
            return false;
        }
        if (typeof _field === 'string' && _field === 'password') {
            return true;
        }
        if (typeof _field === 'object' && _field.type === 'password') {
            return true;
        }
        return false;
    };
    /**
     * checkPassword
     * @param uid {string}
     * @param field {string}
     * @param password {string}
     *
     * @returns Promise<new>
     */
    Model.prototype.checkPassword = function (uid, field, password) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_b) {
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var check, error_1;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _b.trys.push([0, 2, , 3]);
                                    if (!this._check_if_password_type(field)) {
                                        throw new Error("Field " + field + " is not of type PASSWORD.");
                                    }
                                    return [4 /*yield*/, this._execute("{\n          " + this.schema.name + " (func: uid(" + uid + ")) {\n            isValid: checkpwd(" + this.schema.name + "." + field + ", \"" + password + "\")\n          }\n        }")];
                                case 1:
                                    check = _b.sent();
                                    if (check.length === 0) {
                                        return [2 /*return*/, resolve(false)];
                                    }
                                    return [2 /*return*/, resolve(check[0].isValid)];
                                case 2:
                                    error_1 = _b.sent();
                                    return [2 /*return*/, reject(error_1)];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    /**
     * _generate_methods
     *
     * @returns void
     */
    Model.prototype._generate_methods = function () {
        Object.keys(methods_1.default).forEach(function (_method) {
            Model.prototype[_method] = function (field, value, params) {
                if (value === void 0) { value = null; }
                if (params === void 0) { params = null; }
                return this._method(_method, field, value, params);
            };
        });
    };
    /**
     * _execute
     * @param query {string}
     *
     * @returns Promise<new>
     */
    Model.prototype._execute = function (query) {
        var _this = this;
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var _txn, res, error_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _txn = this.connection.client.newTxn();
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, 5, 7]);
                        return [4 /*yield*/, _txn.query(query)];
                    case 2:
                        res = _b.sent();
                        return [2 /*return*/, resolve(res.getJson()[this.schema.name])];
                    case 3:
                        error_2 = _b.sent();
                        return [4 /*yield*/, _txn.discard()];
                    case 4:
                        _b.sent();
                        return [2 /*return*/, reject(error_2)];
                    case 5: return [4 /*yield*/, _txn.discard()];
                    case 6:
                        _b.sent();
                        return [7 /*endfinally*/];
                    case 7: return [2 /*return*/];
                }
            });
        }); });
    };
    /**
     * _method
     * @param type {string}
     * @param field {any}
     * @param value {any}
     * @param params {any}
     *
     * @returns Promise<new>
     */
    Model.prototype._method = function (type, field, value, params) {
        if (value === void 0) { value = null; }
        if (params === void 0) { params = null; }
        return __awaiter(this, void 0, void 0, function () {
            var _params, query;
            return __generator(this, function (_b) {
                if (type === methods_1.default.uid || type === methods_1.default.has) {
                    params = value;
                    value = field;
                }
                _params = this._validate(this.schema.original, params);
                query = new query_1.default(type, field, value, _params, this.schema.name, this._logger);
                return [2 /*return*/, this._execute(query.query)];
            });
        });
    };
    /**
     * query
     * @param query {string}
     *
     * @returns Promise<new>
     */
    Model.prototype.query = function (query) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_b) {
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var _txn, data, error_3;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _txn = this.connection.client.newTxn();
                                    _b.label = 1;
                                case 1:
                                    _b.trys.push([1, 3, 5, 7]);
                                    return [4 /*yield*/, _txn.query(query)];
                                case 2:
                                    data = _b.sent();
                                    // await _txn.commit();
                                    return [2 /*return*/, resolve(data.getJson())];
                                case 3:
                                    error_3 = _b.sent();
                                    return [4 /*yield*/, _txn.discard()];
                                case 4:
                                    _b.sent();
                                    return [2 /*return*/, reject(error_3)];
                                case 5: return [4 /*yield*/, _txn.discard()];
                                case 6:
                                    _b.sent();
                                    return [7 /*endfinally*/];
                                case 7: return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    /**
     * queryWithVars
     * @param params {QueryParams}
     *
     * @returns Promise<new>
     */
    Model.prototype.queryWithVars = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_b) {
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var _txn, data, error_4;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _txn = this.connection.client.newTxn();
                                    _b.label = 1;
                                case 1:
                                    _b.trys.push([1, 3, 5, 7]);
                                    return [4 /*yield*/, _txn.queryWithVars(params.query, params.variables)];
                                case 2:
                                    data = _b.sent();
                                    //await _txn.commit();
                                    return [2 /*return*/, resolve(data.getJson())];
                                case 3:
                                    error_4 = _b.sent();
                                    return [4 /*yield*/, _txn.discard()];
                                case 4:
                                    _b.sent();
                                    return [2 /*return*/, reject(error_4)];
                                case 5: return [4 /*yield*/, _txn.discard()];
                                case 6:
                                    _b.sent();
                                    return [7 /*endfinally*/];
                                case 7: return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    /**
     * _is_relation
     * @param _key {string}
     *
     * @returns boolean
     */
    Model.prototype._is_relation = function (_key) {
        var _field = this.schema.original[_key];
        if (typeof _field !== 'undefined' && typeof _field !== 'string' && _field.type === 'uid') {
            return true;
        }
        return false;
    };
    /**
     * _parse_mutation
     * @param mutation {any}
     * @param name {string}
     *
     * @returns {[index: string]: any}
     */
    Model.prototype._parse_mutation = function (mutation, name) {
        var _this = this;
        var _mutation = {};
        Object.keys(mutation).forEach(function (_key) {
            if (_this._is_relation(_key)) {
                if (Array.isArray(mutation[_key])) {
                    var _m_1 = [];
                    mutation[_key].forEach(function (_uid) {
                        _m_1.push({
                            uid: _uid
                        });
                    });
                    _mutation[name + "." + _key] = _m_1;
                }
                else {
                    _mutation[name + "." + _key] = {
                        uid: mutation[_key]
                    };
                }
            }
            else {
                _mutation[name + "." + _key] = mutation[_key];
            }
        });
        return _mutation;
    };
    /**
     * _create
     * @param mutation {any}
     *
     * @returns Promise<any>
     */
    Model.prototype._create = function (mutation) {
        var _this = this;
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var _txn, mu, _unique_check, _mutation, _uid, data, error_5;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _txn = this.connection.client.newTxn();
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 7, 9, 11]);
                        mu = new this.connection.dgraph.Mutation();
                        mu.setSetJson(mutation);
                        return [4 /*yield*/, this._check_unique_values(mutation, _txn)];
                    case 2:
                        _unique_check = _b.sent();
                        if (!_unique_check) return [3 /*break*/, 4];
                        return [4 /*yield*/, _txn.discard()];
                    case 3:
                        _b.sent();
                        return [2 /*return*/, reject(new Error("[Unique Constraint]: " + _unique_check))];
                    case 4:
                        mu.setCommitNow(true);
                        mu.setIgnoreIndexConflict(true);
                        return [4 /*yield*/, _txn.mutate(mu)];
                    case 5:
                        _mutation = _b.sent();
                        _uid = _mutation.wrappers_[1].get('blank-0');
                        return [4 /*yield*/, this._method('uid', _uid)];
                    case 6:
                        data = _b.sent();
                        return [2 /*return*/, resolve(data[0])];
                    case 7:
                        error_5 = _b.sent();
                        return [4 /*yield*/, _txn.discard()];
                    case 8:
                        _b.sent();
                        return [2 /*return*/, reject(error_5)];
                    case 9: return [4 /*yield*/, _txn.discard()];
                    case 10:
                        _b.sent();
                        return [7 /*endfinally*/];
                    case 11: return [2 /*return*/];
                }
            });
        }); });
    };
    /**
     * create
     * @param data {any}
     *
     * @returns Promise<any>
     */
    Model.prototype.create = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var mutation;
            return __generator(this, function (_b) {
                this._check_attributes(this.schema.original, data, true);
                mutation = this._parse_mutation(data, this.schema.name);
                return [2 /*return*/, this._create(mutation)];
            });
        });
    };
    /**
     * _update
     * @param mutation {any}
     * @param uid {any}
     *
     * @returns Promise<any>
     */
    Model.prototype._update = function (mutation, uid) {
        var _this = this;
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var _txn, mu, error_6;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _txn = this.connection.client.newTxn();
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, 5, 7]);
                        mu = new this.connection.dgraph.Mutation();
                        mutation.uid = uid;
                        mu.setCommitNow(true);
                        mu.setIgnoreIndexConflict(true);
                        mu.setSetJson(mutation);
                        return [4 /*yield*/, _txn.mutate(mu)];
                    case 2:
                        _b.sent();
                        return [2 /*return*/, resolve(true)];
                    case 3:
                        error_6 = _b.sent();
                        return [4 /*yield*/, _txn.discard()];
                    case 4:
                        _b.sent();
                        return [2 /*return*/, reject(error_6)];
                    case 5: return [4 /*yield*/, _txn.discard()];
                    case 6:
                        _b.sent();
                        return [7 /*endfinally*/];
                    case 7: return [2 /*return*/];
                }
            });
        }); });
    };
    /**
     * update
     * @param data {any}
     * @param uid {any}
     *
     * @returns Promise<any>
     */
    Model.prototype.update = function (data, uid) {
        return __awaiter(this, void 0, void 0, function () {
            var _keys, mutation, _delete, _isDelete, _key, data_1, _uids;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!uid) {
                            return [2 /*return*/];
                        }
                        _keys = Object.keys(data);
                        if (_keys.length === 0) {
                            return [2 /*return*/];
                        }
                        this._check_attributes(this.schema.original, data, true);
                        mutation = this._parse_mutation(data, this.schema.name);
                        _delete = null;
                        _isDelete = false;
                        Object.keys(data).forEach(function (_key) {
                            _delete = {};
                            if (_this.schema.original[_key].replace) {
                                _isDelete = true;
                                _delete[_this.schema.name + "." + _key] = null;
                            }
                        });
                        if (!_isDelete) return [3 /*break*/, 2];
                        _delete.uid = uid;
                        return [4 /*yield*/, this._delete(_delete)];
                    case 1:
                        _b.sent();
                        _b.label = 2;
                    case 2:
                        if (typeof uid === 'string') {
                            return [2 /*return*/, this._update(mutation, uid)];
                        }
                        if (!(typeof uid === 'object')) return [3 /*break*/, 4];
                        _key = Object.keys(uid)[0];
                        return [4 /*yield*/, this._method('has', _key, {
                                filter: uid
                            })];
                    case 3:
                        data_1 = _b.sent();
                        if (data_1.length > 0) {
                            _uids = utility_1.pluck(data_1, 'uid');
                            _uids.forEach(function (_uid) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_b) {
                                    switch (_b.label) {
                                        case 0: return [4 /*yield*/, this._update(mutation, _uid)];
                                        case 1:
                                            _b.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); });
                        }
                        _b.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * _delete
     * @param mutation {any}
     *
     * @returns Promise<any>
     */
    Model.prototype._delete = function (mutation) {
        var _this = this;
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var _txn, mu, error_7;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _txn = this.connection.client.newTxn();
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, 5, 7]);
                        mu = new this.connection.dgraph.Mutation();
                        mu.setCommitNow(true);
                        mu.setIgnoreIndexConflict(true);
                        mu.setDeleteJson(mutation);
                        return [4 /*yield*/, _txn.mutate(mu)];
                    case 2:
                        _b.sent();
                        return [2 /*return*/, resolve(true)];
                    case 3:
                        error_7 = _b.sent();
                        return [4 /*yield*/, _txn.discard()];
                    case 4:
                        _b.sent();
                        return [2 /*return*/, reject(error_7)];
                    case 5: return [4 /*yield*/, _txn.discard()];
                    case 6:
                        _b.sent();
                        return [7 /*endfinally*/];
                    case 7: return [2 /*return*/];
                }
            });
        }); });
    };
    /**
     * delete
     * @param params {any}
     * @param uid {any}
     *
     * @returns Promise<any>
     */
    Model.prototype.delete = function (params, uid) {
        if (uid === void 0) { uid = null; }
        return __awaiter(this, void 0, void 0, function () {
            var _uids, _i, params_1, _uid, _fields, _data, _params, _loop_1, this_1, _b, _c, _key;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        if (typeof params === 'object' && !Array.isArray(params)) {
                            this._check_attributes(this.schema.original, params, true);
                        }
                        if (!!uid) return [3 /*break*/, 3];
                        if (typeof params === 'string') {
                            return [2 /*return*/, this._delete({
                                    uid: params
                                })];
                        }
                        if (Array.isArray(params)) {
                            _uids = [];
                            for (_i = 0, params_1 = params; _i < params_1.length; _i++) {
                                _uid = params_1[_i];
                                _uids.push({
                                    uid: _uid
                                });
                            }
                            return [2 /*return*/, this._delete(_uids)];
                        }
                        if (!(typeof params === 'object')) return [3 /*break*/, 2];
                        _fields = Object.keys(params);
                        return [4 /*yield*/, this._method('has', _fields[0], {
                                attributes: ['uid'],
                                filter: params
                            })];
                    case 1:
                        _data = _d.sent();
                        if (_data.length === 0) {
                            return [2 /*return*/];
                        }
                        return [2 /*return*/, this.delete(utility_1.pluck(_data, 'uid'))];
                    case 2: return [3 /*break*/, 4];
                    case 3:
                        _params = {};
                        _loop_1 = function (_key) {
                            if (this_1._is_relation(_key)) {
                                if (Array.isArray(params[_key])) {
                                    var _a_1 = [];
                                    params[_key].forEach(function (_uid) {
                                        _a_1.push({
                                            uid: _uid
                                        });
                                    });
                                    _params[this_1.schema.name + "." + _key] = _a_1;
                                }
                                else {
                                    if (this_1.schema.original[_key].replace) {
                                        _params[this_1.schema.name + "." + _key] = null;
                                    }
                                    else {
                                        _params[this_1.schema.name + "." + _key] = {
                                            uid: params[_key]
                                        };
                                    }
                                }
                            }
                            else {
                                _params[this_1.schema.name + "." + _key] = null;
                            }
                        };
                        this_1 = this;
                        for (_b = 0, _c = Object.keys(params); _b < _c.length; _b++) {
                            _key = _c[_b];
                            _loop_1(_key);
                        }
                        _d.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * _get_unique_fields
     *
     * @returns Array<string>
     */
    Model.prototype._get_unique_fields = function () {
        var _this = this;
        var _unique = [];
        Object.keys(this.schema.original).forEach(function (_key) {
            var _param = _this.schema.original[_key];
            if (typeof _param !== 'string' && _param.unique) {
                _unique.push(_key);
            }
        });
        return _unique;
    };
    /**
     * _check_unique_values
     * @param mutation {any}
     * @param _txn {any}
     *
     * @returns Promise<any>
     */
    Model.prototype._check_unique_values = function (mutation, _txn) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_b) {
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var _unique, _i, _unique_1, _key, _mvalue, _param, _value;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _unique = this._get_unique_fields();
                                    if (_unique.length === 0) {
                                        return [2 /*return*/, resolve(false)];
                                    }
                                    _i = 0, _unique_1 = _unique;
                                    _b.label = 1;
                                case 1:
                                    if (!(_i < _unique_1.length)) return [3 /*break*/, 4];
                                    _key = _unique_1[_i];
                                    _mvalue = mutation[this.schema.name + "." + _key];
                                    _param = this.schema.original[_key];
                                    if (typeof _param !== 'string' && _param.type === 'string') {
                                        _mvalue = '"' + _mvalue + '"';
                                    }
                                    return [4 /*yield*/, _txn.query("{\n           data (func: eq(" + this.schema.name + "." + _key + ", " + _mvalue + ")) {\n            " + _key + ": " + this.schema.name + "." + _key + "\n           } \n          }")];
                                case 2:
                                    _value = _b.sent();
                                    if (_value.getJson().data.length > 0) {
                                        return [2 /*return*/, resolve("Duplicate value for " + _key)];
                                    }
                                    _b.label = 3;
                                case 3:
                                    _i++;
                                    return [3 /*break*/, 1];
                                case 4: return [2 /*return*/, resolve(false)];
                            }
                        });
                    }); })];
            });
        });
    };
    /**
     * _lang_fields
     * @param original {any}
     *
     * @returns Array<string>
     */
    Model.prototype._lang_fields = function (original) {
        var _fields = [];
        Object.keys(original).forEach(function (_key) {
            if (original[_key].type === types_1.default.STRING && original[_key].lang) {
                _fields.push(_key);
            }
        });
        return _fields;
    };
    /**
     * _check_attributes
     * @param original {any}
     * @param attributes {any}
     * @param isUpdate {boolean}
     * @param isRelation {boolean}
     *
     * @returs void
     */
    Model.prototype._check_attributes = function (original, data, isUpdate, isRelation) {
        if (isUpdate === void 0) { isUpdate = false; }
        if (isRelation === void 0) { isRelation = false; }
        var attributes = data;
        var haveData = false;
        if (!Array.isArray(data)) {
            attributes = Object.keys(data);
            haveData = true;
        }
        if (!attributes || attributes.length === 0) {
            return;
        }
        var _lang_fields = this._lang_fields(original);
        for (var _i = 0, attributes_1 = attributes; _i < attributes_1.length; _i++) {
            var attribute = attributes_1[_i];
            if (attribute.indexOf('@') === -1 && typeof original[attribute] === 'undefined') {
                throw new Error(this.schema.name + " has no attribute " + attribute);
            }
            else if (attribute.indexOf('@') !== -1 && _lang_fields.indexOf(attribute.split('@')[0]) === -1) {
                throw new Error(this.schema.name + " has no lang property in " + attribute);
            }
            else if (typeof original[attribute] === 'object' && original[attribute].type !== 'uid' && isRelation) {
                throw new Error(attribute + " is not a relation.");
            }
            else if (typeof original[attribute] === 'object' && original[attribute].type === 'uid' && !isUpdate) {
                throw new Error(attribute + " is a realtion and must be in include.");
            }
            else if (typeof original[attribute] === 'object' && original[attribute].replace && haveData && Array.isArray(data[attribute])) {
                throw new Error("The value of " + attribute + " cannot be an array as it has replace set to true.");
            }
        }
    };
    /**
     * _all_attributes
     * @param original {any}
     *
     * @return Array<string>
     */
    Model.prototype._all_attributes = function (original) {
        var _attrs = [];
        for (var _i = 0, _b = Object.keys(original); _i < _b.length; _i++) {
            var attr = _b[_i];
            if (original[attr].type === 'uid' || original[attr] === 'password' || original[attr].type === 'password') {
                continue;
            }
            _attrs.push(attr);
        }
        return _attrs;
    };
    /**
     * _validate
     * @param original {any}
     * @param params {any}
     *
     * @returns Params
     */
    Model.prototype._validate = function (original, params) {
        if (params === void 0) { params = {}; }
        if (!params) {
            params = {};
        }
        if (!params.attributes || params.attributes.length === 0) {
            params.attributes = this._all_attributes(original);
        }
        var _index = params.attributes.indexOf('uid');
        if (_index !== -1) {
            params.attributes.splice(_index, 1);
        }
        this._check_attributes(original, params.attributes);
        params.attributes.unshift('uid');
        if (params.include) {
            for (var _i = 0, _b = Object.keys(params.include); _i < _b.length; _i++) {
                var relation = _b[_i];
                if (typeof original[relation] === 'undefined') {
                    throw new Error(this.schema.name + " has no relation " + relation);
                }
                params.include[relation].model = original[relation].model;
                this._validate(this._models[original[relation].model], params.include[relation]);
            }
        }
        return params;
    };
    return Model;
}());
exports.default = Model;
//# sourceMappingURL=model.js.map