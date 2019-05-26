declare class Model {
    [index: string]: any;
    schema: any;
    models: any;
    connection: any;
    private _logger;
    constructor(schema: any, models: any, connection: any, logger: Function);
    _check_if_password_type(field: any): boolean;
    checkPassword(uid: any, field: any, password: any): Promise<{}>;
    _generate_methods(): {
        [index: string]: any;
    };
    _execute(query: any): Promise<{}>;
    _method(type: any, field: any, value?: any, params?: any): Promise<{}>;
    query(query: any): Promise<{}>;
    queryWithVars(params: any): Promise<{}>;
    _is_relation(_key: any): boolean;
    _parse_mutation(mutation: any, name: any): {
        [index: string]: any;
    };
    _create(mutation: any): Promise<{}>;
    create(data: any): Promise<{}>;
    _update(mutation: any, uid: any): Promise<{}>;
    update(data: any, uid: any): Promise<{}>;
    _delete(mutation: any): Promise<any>;
    delete(params: any, uid?: any): Promise<any>;
    _get_unique_fields(): any;
    _check_unique_values(mutation: any, _txn: any): Promise<{}>;
    _check_attributes(original: any, attributes: any, isUpdate?: boolean): void;
    _all_attributes(original: any): string[];
    _validate(original: any, params?: any): any;
}
export default Model;
