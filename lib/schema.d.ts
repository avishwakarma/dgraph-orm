declare class Schema {
    private _schema;
    name: string;
    schema: any;
    original: any;
    constructor(name: any, schema: any);
    private _build;
    private _generate;
}
export default Schema;
