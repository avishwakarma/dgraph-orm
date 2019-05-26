"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var dgraph = __importStar(require("dgraph-js"));
var grpc = __importStar(require("grpc"));
var _config = {
    host: '127.0.0.1',
    port: 9080,
    debug: false,
    credentails: grpc.credentials.createInsecure()
};
var Connection = /** @class */ (function () {
    function Connection(config, logger) {
        if (config === void 0) { config = {}; }
        if (logger === void 0) { logger = console.log; }
        this.dgraph = dgraph;
        this.config = __assign({}, _config, config);
        try {
            this.clientStub = new dgraph.DgraphClientStub(this.config.host + ":" + this.config.port, this.config.credentails);
            this.client = new dgraph.DgraphClient(this.clientStub);
            if (this.config.debug) {
                this.client.setDebugMode(true);
            }
        }
        catch (error) {
            logger(error);
        }
    }
    Connection.prototype.close = function () {
        this.clientStub.close();
    };
    return Connection;
}());
exports.default = Connection;
//# sourceMappingURL=connection.js.map