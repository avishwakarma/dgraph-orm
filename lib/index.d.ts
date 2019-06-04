import Schema from './schema';
import Model from './model';
import { TypesType, SchemaFields, ConnectionConfig, QueryParams } from './types';
declare class DgraphSchema {
    private _logger;
    private connection;
    Types: TypesType;
    Schema: {
        new (name: string, schema: SchemaFields): Schema;
    };
    constructor();
    disconnect(): void;
    logging(callback: Function): void;
    _log(message: string): void;
    _set_model(schema: Schema): void;
    _generate_schema(schema: Array<string>): Promise<void>;
    private _create_connection;
    model(schema: Schema): Model;
    connect(config: ConnectionConfig): void;
    query(params: QueryParams): Promise<any>;
    mutate(mutation: string): Promise<any>;
}
declare const _default: DgraphSchema;
export default _default;
