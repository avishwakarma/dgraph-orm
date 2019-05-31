import { prepareSchema, checkOptions } from './helpers/utility';
import { SchemaFields, FieldProps } from './types';

class Schema {
  name: string;
  schema: any;
  original: any;
  
  constructor(name: string, schema: SchemaFields) {

    this.schema = this._generate(name, schema);

    this.name = name;
    this.original = schema;
  }

  private _build(name: string, params: string | FieldProps) {
    checkOptions(name, params);
    return prepareSchema(name, params);
  }

  private _generate(name: string, original: SchemaFields) {
    const _schema: Array<string> = [];
    Object.keys(original).forEach((key: string) => {
      _schema.push(name + '.' + this._build(key, original[key]));
    });

    return _schema;
  }
}

export default Schema;