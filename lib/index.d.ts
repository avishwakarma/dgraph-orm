import Model from './model';
declare class DgraphSchema {
    private _models;
    private _logger;
    private connection;
    Types: any;
    Schema: any;
    constructor();
    disconnect(): void;
    logging(callback: any): void;
    _log(message: any): void;
    _set_model(schema: any): Promise<void>;
    private _create_connection;
    model(schema: any): Model;
    connect(config: any): void;
    query(params: any): any;
    mutate(mutation: any): any;
}
declare const _default: DgraphSchema;
export default _default;
