"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var types_1 = __importDefault(require("./types"));
var tokenmap = {};
tokenmap[types_1.default.STRING] = [
    'exact',
    'hash',
    'term',
    'fulltext',
    'trigram'
];
tokenmap[types_1.default.DATETIME] = [
    'year',
    'month',
    'day',
    'hour'
];
exports.default = tokenmap;
//# sourceMappingURL=tokenmap.js.map