import { prepareSchema, checkOptions } from './helpers/utility';

class Schema {
  private _schema: Array<any>;
  name: string;
  schema: any;
  original: any;
  
  constructor(name: any, schema: any) {
    this._schema = [];

    this._generate(name, schema);

    this.name = name;
    this.schema = this._schema;
    this.original = schema;
  }

 private _build(name: string, params: any) {
    checkOptions(name, params);
    return prepareSchema(name, params);
  }

  private _generate(name: string, original: any) {
    Object.keys(original).forEach((key) => {
      this._schema.push(name + '.' + this._build(key, original[key]));
    });
  }
}

export default Schema;