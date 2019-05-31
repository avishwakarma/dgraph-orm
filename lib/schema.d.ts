import { SchemaFields } from './types';
declare class Schema {
    name: string;
    schema: Array<string>;
    original: SchemaFields;
    constructor(name: string, schema: SchemaFields);
    private _build;
    private _generate;
}
export default Schema;
