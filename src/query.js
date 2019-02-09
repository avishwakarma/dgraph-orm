
class Query {
  constructor(type, name, params, client) {
    this.name = name;
    this.type = type;
    this.params = params;
    this.client = client;

    const query = this._compose_params();
  }

  _compose_params() {
    switch(this.type) {
      case 'id':
        return this._build(this.params, {uid: this.params.where.uid})
      break;
    }
  }

  _where(type, where) {
    console.log(type, where);
  }

  _parse_where(where) {
    let _where = '';
    for(let key of Object.keys(where)) {
      if(key === 'uid') {
        return `uid(${where[key]})`;
      }else {
        _where += this._where(key, where[key]);
      }
    }

    return _where;
  }

  _attributes(attributes, name) {

    console.log(attributes, name);

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

      if(include[relation].where) {
        _inc += `(func: ${this._parse_where(include[relation].where)})`;
      }
      _inc += `{
        ${this._attributes(include[relation].attributes, include[relation].model)}
      }`
    }

    return _inc;
  }

  _build(params, where) {
    const query = `{
      ${this.name} (
        func: ${this._parse_where(where)}
      ) {
        ${this._attributes(params.attributes, this.name)}
        ${this._include(params.include)}
      }
    }`;

    console.log(query);
  }
}

module.exports = Query;