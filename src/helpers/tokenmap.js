"use strict";
exports.__esModule = true;
var types_1 = require("./types");
var tokenmap = {};
tokenmap[types_1["default"].STRING] = [
    'exact',
    'hash',
    'term',
    'fulltext',
    'trigram'
];
tokenmap[types_1["default"].DATETIME] = [
    'year',
    'month',
    'day',
    'hour'
];
exports["default"] = tokenmap;
