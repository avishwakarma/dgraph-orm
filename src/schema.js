const { prepareSchema, checkOptions } = require('./helpers/utility');

class Schema {
  constructor(name, schema) {
    this._schema = [];

    this._generate(name, schema);

    return {
      name,
      schema: this._schema,
      original: schema
    }
  }

  _build(name, params) {
    checkOptions(name, params);
    return prepareSchema(name, params);
  }

  _generate(name, original) {
    Object.keys(original).forEach((key) => {
      this._schema.push(name + '.' + this._build(key, original[key]));
    });
  }
}

module.exports = Schema;