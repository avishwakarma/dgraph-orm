import types from './types';
import typemap from './typemap';
import tokenmap from './tokenmap';

export function checkOptions(name: string, options: any) {
  Object.keys(options).forEach(function(key, index){
    if(key === 'type' || typeof options === 'string') return;

    if(typemap[options.type].indexOf(key) === -1) {
      throw new Error('[Type Error]: In ' + name + ' of type ' + options.type.toUpperCase() + ', ' + key + ' is not allowed.');
    }
  });

  if(typeof options === 'string') {
    return;
  }

  if(options.type === types.UID && !options.model) {
    throw new Error('[Type Error]: In ' + name + ' of type ' + options.type.toUpperCase() + ', model is required.');
  }

  if(options.count && (options.type !== types.UID && !options.list)) {
    throw new Error('[Type Error]: In ' + name + ' of type ' + options.type.toUpperCase() + ', count requires list.');
  }

  if(!options.index && options.token) {
    throw new Error('[Type Error]: In ' + name + ' of type ' + options.type.toUpperCase() + ', token requires index.');
  }

  if(!options.token && options.index && (options.type === types.DATETIME || options.type === types.STRING)) {
    throw new Error('[Type Error]: In ' + name + ' of type ' + options.type.toUpperCase() + ', index requires token.');
  }

  if(options.type === types.DATETIME && options.index && typeof options.token !== 'string') {
    throw new Error('[Type Error]: In ' + name + ' of type ' + options.type.toUpperCase() + ', token must be a string.');
  }

  if(options.type === types.DATETIME && options.index && tokenmap[types.DATETIME].indexOf(options.token) === -1) {
    throw new Error('[Type Error]: In ' + name + ' of type ' + options.type.toUpperCase() + ', token must be any one of ' + tokenmap[types.DATETIME].join(', ') + '.');
  }

  if(options.token && options.type !== types.DATETIME) {
    if(options.token.exact && options.token.hash) {
      throw new Error('[Type Error]: In ' + name + ' of type ' + options.type.toUpperCase() + ', exact and hash index types shouldn\'t be used together.');
    }

    if(options.token.exact && options.token.term) {
      throw new Error('[Type Error]: In ' + name + ' of type ' + options.type.toUpperCase() + ', exact or hash index types shouldn\'t be used alongside the term index type.');
    }

    if(options.token.hash && options.token.term) {
      throw new Error('[Type Error]: In ' + name + ' of type ' + options.type.toUpperCase() + ', exact or hash index types shouldn\'t be used alongside the term index type.');
    }

    Object.keys(options.token).forEach(function(key) {
      if(tokenmap[options.type].indexOf(key) === -1) {
        throw new Error('[Type Error]: In ' + name + ' of type ' + options.type.toUpperCase() + ', for token only ' + tokenmap[options.type].join(', ') + ' are allowd.');
      }
    });
  }
}

export function prepareSchema(name: any, options: any) {

  if(typeof options === 'string') {
    return name + ': ' + options + ' .';
  }

  let schema = options.type + ' ';

  if(options.list) {
    schema = '[' + schema + '] ';
  }

  if(options.index) {
    if(options.type !== types.STRING && options.type !== types.DATETIME) {
      schema += ' @index(' + options.type + ') ';
    }else if(options.type === types.DATETIME) {
      schema += ' @index(' + options.token + ') ';
    }else {
      schema += ' @index(' + Object.keys(options.token).join(', ') + ') ';
    }
  }

  Object.keys(options).forEach(function(key){
    if(key === 'type' || key === 'list' || key === 'index' || key === 'token' || key === 'model' || key === 'unique') {
      return;
    }

    schema += '@' + key + ' ';
  });

  return name + ': ' + schema + '.';
}

export function pluck(arr: any, key: any) {
  const _data = [];

  if(!Array.isArray(arr)) {
    return [];
  }

  for(let obj of arr) {
    if(typeof obj === 'object' && typeof obj[key] !== 'undefined') {
      _data.push(obj[key]);
    }
  }

  return _data;
}