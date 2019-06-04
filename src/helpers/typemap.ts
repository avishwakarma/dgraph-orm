/**
 * typemap
 * 
 * dgraph-orm type map
 * 
 * @author Ashok Vishwakarma <akvlko@gmail.com>
 */

import types from './types';

const typemap: {[index: string]: Array<string>} = {};

typemap[types.STRING] = ['list', 'count', 'lang', 'index', 'upsert', 'token', 'unique'];
typemap[types.INT] = ['list', 'count', 'index', 'upsert', 'unique'];
typemap[types.FLOAT] = ['list', 'count', 'index', 'upsert', 'unique'];
typemap[types.BOOL] = ['list', 'count', 'index', 'upsert'];
typemap[types.DATETIME] = ['list', 'count', 'index', 'upsert', 'token'];
typemap[types.GEO] = ['list', 'count', 'index', 'upsert'];
typemap[types.PASSWORD] = [];
typemap[types.UID] = ['count', 'reverse', 'model'];

export default typemap;