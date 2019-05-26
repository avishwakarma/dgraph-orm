"use strict";
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
var query_1 = __importDefault(require("./query"));
var methods_1 = __importDefault(require("./helpers/methods"));
var utility_1 = require("./helpers/utility");
var Model = /** @class */ (function () {
    function Model(schema, models, connection, logger) {
        this.schema = schema;
        this.models = models;
        this.connection = connection;
        this._logger = logger;
        this._generate_methods();
    }
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
    Model.prototype._generate_methods = function () {
        var _this = this;
        var _methods = {};
        Object.keys(methods_1.default).forEach(function (_method) {
            Model.prototype[_method] = _this._method.bind(_this, _method);
        });
        return _methods;
    };
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
                        // await _txn.commit();
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
    Model.prototype._method = function (type, field, value, params) {
        if (value === void 0) { value = null; }
        if (params === void 0) { params = null; }
        return __awaiter(this, void 0, void 0, function () {
            var query;
            return __generator(this, function (_b) {
                if (type === methods_1.default.uid || type === methods_1.default.has) {
                    params = value;
                    value = field;
                }
                params = this._validate(this.schema.original, params);
                query = new query_1.default(type, field, value, params, this.schema.name, this._logger);
                console.log(query);
                return [2 /*return*/, this._execute(query.query)];
            });
        });
    };
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
    Model.prototype._is_relation = function (_key) {
        var _field = this.schema.original[_key];
        if (typeof _field !== 'undefined' && _field.type === 'uid') {
            return true;
        }
        return false;
    };
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
    Model.prototype.create = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var mutation;
            return __generator(this, function (_b) {
                this._check_attributes(this.schema.original, Object.keys(data));
                mutation = this._parse_mutation(data, this.schema.name);
                return [2 /*return*/, this._create(mutation)];
            });
        });
    };
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
    Model.prototype.update = function (data, uid) {
        return __awaiter(this, void 0, void 0, function () {
            var mutation, _keys, _first, _filter_1, data_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!uid) {
                            return [2 /*return*/];
                        }
                        if (Object.keys(data).length === 0) {
                            return [2 /*return*/];
                        }
                        this._check_attributes(this.schema.original, Object.keys(data), true);
                        mutation = this._parse_mutation(data, this.schema.name);
                        if (typeof uid === 'string') {
                            return [2 /*return*/, this._update(mutation, uid)];
                        }
                        if (!(typeof uid === 'object')) return [3 /*break*/, 2];
                        _keys = Object.keys(uid);
                        _first = _keys.splice(0, 1)[0];
                        _filter_1 = {};
                        if (_keys.length > 0) {
                            _keys.forEach(function (_key) {
                                _filter_1[_key] = {
                                    $eq: uid[_key]
                                };
                            });
                        }
                        return [4 /*yield*/, this._method('eq', _first, uid[_first], {
                                filter: _filter_1
                            })];
                    case 1:
                        data_1 = _b.sent();
                        if (data_1.length > 0) {
                            this._update(mutation, data_1[0].uid);
                        }
                        _b.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
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
    Model.prototype.delete = function (params, uid) {
        if (uid === void 0) { uid = null; }
        return __awaiter(this, void 0, void 0, function () {
            var _uids, _i, params_1, _uid, _fields, _data, _params_1, _loop_1, this_1, _b, _c, _key, _p_1;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
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
                        _params_1 = {};
                        this._check_attributes(this.schema.original, Object.keys(params), true);
                        _loop_1 = function (_key) {
                            if (this_1._is_relation(_key)) {
                                if (Array.isArray(params[_key])) {
                                    var _a_1 = [];
                                    params[_key].forEach(function (_uid) {
                                        _a_1.push({
                                            uid: _uid
                                        });
                                    });
                                    _params_1[this_1.schema.name + "." + _key] = _a_1;
                                }
                                else {
                                    _params_1[this_1.schema.name + "." + _key] = {
                                        uid: params[_key]
                                    };
                                }
                            }
                            else {
                                _params_1[this_1.schema.name + "." + _key] = null;
                            }
                        };
                        this_1 = this;
                        for (_b = 0, _c = Object.keys(params); _b < _c.length; _b++) {
                            _key = _c[_b];
                            _loop_1(_key);
                        }
                        if (Array.isArray(uid)) {
                            _p_1 = [];
                            uid.forEach(function (_uid) {
                                _params_1.uid = _uid;
                                _p_1.push(_params_1);
                            });
                            return [2 /*return*/, this._delete(_p_1)];
                        }
                        _params_1.uid = uid;
                        return [2 /*return*/, this._delete(_params_1)];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Model.prototype._get_unique_fields = function () {
        var _this = this;
        var _unique = [];
        Object.keys(this.schema.original).forEach(function (_key) {
            if (_this.schema.original[_key].unique) {
                _unique.push(_key);
            }
        });
        return _unique;
    };
    Model.prototype._check_unique_values = function (mutation, _txn) {
        return __awaiter(this, void 0, void 0, function () {
            var _unique;
            var _this = this;
            return __generator(this, function (_b) {
                _unique = this._get_unique_fields();
                if (_unique.length === 0) {
                    return [2 /*return*/, false];
                }
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var _i, _unique_1, _key, _mvalue, _value;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _i = 0, _unique_1 = _unique;
                                    _b.label = 1;
                                case 1:
                                    if (!(_i < _unique_1.length)) return [3 /*break*/, 4];
                                    _key = _unique_1[_i];
                                    _mvalue = mutation[this.schema.name + "." + _key];
                                    if (this.schema.original[_key].type === 'string') {
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
    Model.prototype._check_attributes = function (original, attributes, isUpdate) {
        if (isUpdate === void 0) { isUpdate = false; }
        if (!attributes || attributes.length === 0) {
            return;
        }
        for (var _i = 0, attributes_1 = attributes; _i < attributes_1.length; _i++) {
            var attribute = attributes_1[_i];
            if (typeof original[attribute] === 'undefined') {
                throw new Error(this.schema.name + " has no attribute " + attribute);
            }
            else if (typeof original[attribute] === 'object' && original[attribute].type === 'uid' && !isUpdate) {
                throw new Error(attribute + " is a realtion and must be in include.");
            }
        }
    };
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
                this._validate(this.models[original[relation].model], params.include[relation]);
            }
        }
        return params;
    };
    return Model;
}());
exports.default = Model;
//# sourceMappingURL=model.js.map