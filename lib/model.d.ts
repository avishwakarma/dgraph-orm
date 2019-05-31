declare class Model {
    [index: string]: any;
    schema: any;
    models: any;
    connection: any;
    private _logger;
    constructor(schema: any, models: any, connection: any, logger: Function);
    _check_if_password_type(field: any): boolean;
    checkPassword(uid: any, field: any, password: any): Promise<unknown>;
    _generate_methods(): {
        [index: string]: any;
    };
    _execute(query: any): Promise<unknown>;
    _method(type: any, field: any, value?: any, params?: any): Promise<unknown>;
    query(query: any): Promise<unknown>;
    queryWithVars(params: any): Promise<unknown>;
    _is_relation(_key: any): boolean;
    _parse_mutation(mutation: any, name: any): {
        [index: string]: any;
    };
    _create(mutation: any): Promise<unknown>;
    create(data: any): Promise<unknown>;
    _update(mutation: any, uid: any): Promise<unknown>;
    update(data: any, uid: any): Promise<unknown>;
    _delete(mutation: any): Promise<any>;
    delete(params: any, uid?: any): Promise<any>;
    _get_unique_fields(): any;
    _check_unique_values(mutation: any, _txn: any): Promise<unknown>;
    _check_attributes(original: any, attributes: any, isUpdate?: boolean): void;
    _all_attributes(original: any): string[];
    _validate(original: any, params?: any): any;
}
export default Model;
