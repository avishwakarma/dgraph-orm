import { ChannelCredentials } from 'grpc';
interface Base {
    include?: Include;
    filter?: Filter;
    attributes?: Array<string>;
    order?: Array<any>;
    first?: number;
    offset?: number;
    after?: string;
}
export interface ConnectionConfig {
    host?: string;
    port?: number;
    debug?: boolean;
    credentails?: ChannelCredentials;
}
export interface Token {
    term?: boolean;
    trigram?: boolean;
    fulltext?: boolean;
    exact?: boolean;
    hash?: boolean;
}
export interface FieldProps {
    type: string;
    index?: boolean;
    token?: string | Token;
    unique?: boolean;
    list?: boolean;
    count?: Boolean;
    lang?: boolean;
    model?: string;
    reverse?: boolean;
    replace?: boolean;
}
export interface QueryParams {
    query: string;
    variables: {
        [key: string]: any;
    };
}
export interface SchemaFields {
    [key: string]: string | FieldProps;
}
export interface TypesType {
    INT: string;
    FLOAT: string;
    STRING: string;
    BOOL: string;
    DATETIME: string;
    GEO: string;
    PASSWORD: string;
    UID: string;
}
export interface MethodsType {
    eq: string;
    uid: string;
    allofterms: string;
    anyofterms: string;
    regexp: string;
    anyoftext: string;
    alloftext: string;
    has: string;
    near: string;
    contains: string;
}
export interface RelationParam {
    field: string | Array<string>;
    attributes?: {
        [key: string]: Array<string>;
    };
}
export interface Filter {
    [key: string]: any;
    $or?: any;
    $and?: any;
}
export interface Include extends Base {
    [key: string]: any;
    as?: string;
}
export interface Params extends Base {
}
export {};
