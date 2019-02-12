const types = require('./types');

const typemap = {};

typemap[types.STRING] = ['list', 'count', 'lang', 'index', 'upsert', 'token', 'unique'];
typemap[types.INT] = ['list', 'count', 'index', 'upsert', 'unique'];
typemap[types.FLOAT] = ['list', 'count', 'index', 'upsert', 'unique'];
typemap[types.BOOL] = ['list', 'count', 'index', 'upsert'];
typemap[types.DATETIME] = ['list', 'count', 'index', 'upsert', 'token'];
typemap[types.GEO] = ['list', 'count', 'index', 'upsert'];
typemap[types.PASSWORD] = [];
typemap[types.UID] = ['count', 'reverse', 'model'];

module.exports = typemap;