
const _first_key_map = {
  $uid: 'uid',
  $uidIn: 'uid_in',
  $has: 'has',
  $near: 'near',
  $within: 'within',
  $contains: 'contains',
  $intersects: 'intersects',
  $allofterms: 'allofterms',
  $anyofterms: 'anyofterms',
  $regexp: 'regexp',
  $alloftext: 'alloftext',
  $eq: 'eq',
  $le: 'le',
  $lt: 'lt',
  $ge: 'ge',
  $gt: 'gt'
}

class Query {
  constructor(name, params) {
    this.name = name;
    this.params = params;
    return {
      query: this._compose_params(),
    };
  }

  _compose_params() {
    return this._build(this.params)
  }

  _where(type, where) {
    let _where = '';
  }

  _parse_filter(key, value, name) {
    if(key.toLowerCase() === '$has') {
      return `${key.replace('$', '')}(${name}.${value})`;
    }

    const _key = Object.keys(value)[0];

    if(_key) {
      let _value = value[_key];

      if(typeof _value === 'string' && _key !== '$regexp') {
        _value = '"' + _value + '"';
      }

      return `${_key.replace('$', '')}(${name}.${key}, ${_value})`; 
    }
  }

  _parse_first_where(where, name) {
    if(!where) {
      return '';
    }

    let _first = '';
    const _first_key = Object.keys(where)[0];
    

    if(_first_key === '$uid') {
      _first = `uid(${where[_first_key]})`;
    }else {
      const _key_name = Object.keys(where[_first_key])[0];
      let _value = where[_first_key][_key_name];
      if(typeof _value === 'string' && _key_name.toLowerCase() !== '$regexp') {
        _value = '"' + _value + '"';
      }
      _first = `${_key_name.replace('$', '')}(${name}.${_first_key}, ${_value})`
    }

    return _first;
  }

  _parse_where(where, name, filterOnly = false) {
    

    const _filters = []

    if(typeof where['filters'] !== 'undefined') {
      Object.keys(where['filters']).forEach(_key => {
        if(_key.toLowerCase() !== '$and' && _key.toLowerCase() !== '$or') {
          _filters.push(this._parse_filter(_key, where['filters'][_key], name));
        }else {
          const _sub = []
          Object.keys(where['filters'][_key]).forEach(_k => {
            _sub.push(this._parse_filter(_k, where['filters'][_key][_k], name))
          });

          if(_sub.length > 0) {
            _filters.push(`(${_sub.join(` ${_key.replace('$', '').toUpperCase()} `)})`);
          }
        }
      });
    }

    if(filterOnly) {
      return ` @filter(${_filters.join(' AND ')})`;
    }

    let _where = `(func: ${this._parse_first_where(where, name)}{{ORDER}}{{LIMIT}})`;

    if(_filters.length > 0) {
      _where += ` @filter(${_filters.join(' AND ')})`;
    }

    return _where;
  }

  _attributes(attributes, name) {
    const _attrs = [];
    for(let attr of attributes) {
      _attrs.push(`${attr}: ${name}.${attr}`);
    }
    
    return _attrs.join('\n');
  }

  _include(include) {
    let _inc = '';

    if(!include) {
      return _inc;
    }

    for(let relation of Object.keys(include)) {
      if(include[relation].count) {
        _inc += `${include[relation].as ? include[relation].as : relation}: count(${this.name}.${relation})`;
        continue;
      }

      _inc += `${include[relation].as ? include[relation].as : relation}: ${this.name}.${relation}`;

      const _limit = this._extras(include[relation]);
        const _order = this._parse_order(include[relation]);

      if(include[relation].filter) {
        _inc +=  `${this._parse_where({filters: include[relation].filter}, include[relation].model, true)}`
      }

      _inc += `{
        ${this._attributes(include[relation].attributes, include[relation].model)}
      }`
    }

    return _inc;
  }

  _extras(params) {
    let _extra = [];

    if(params.first && typeof params.first === 'number') {
      _extra.push(`first: ${params.first}`);
    }

    if(params.offset && typeof params.offset === 'number') {
      _extra.push(`offset: ${params.offset}`);
    }

    if(params.after) {
      _extra.push(`after: ${params.after}`);
    }

    if(_extra.length > 0) {
      return `, ${_extra.join(', ')}`;
    }

    return '';
  }

  _parse_order(order) {
    const _order = [];

    if(order && order.length > 0) {
      if(Array.isArray(order[0])) {
        order.forEach(_o => {
          if(typeof _o[1] !== 'undefined') {
            _order.push(`order${_o[1].toLowerCase()}: ${this.name}.${_o[0]}`);
          }
        });
      }else {
        _order.push(`order${order[1].toLowerCase()}: ${this.name}.${order[0]}`);
      }
    }

    if(_order.length > 0) {
      return `, ${_order.join(', ')}`;
    }

    return '';
  }

  _build(params) {
    const _order = this._parse_order(params.order);
    const _limit = this._extras(params);
    const query = `{
      ${this.name} ${this._parse_where(params.where, this.name).replace('{{ORDER}}', _order).replace('{{LIMIT}}', _limit)} {
        ${this._attributes(params.attributes, this.name)}
        ${this._include(params.include)}
      }
    }`;

    console.log(query);

    return query;
  }
}

module.exports = Query;