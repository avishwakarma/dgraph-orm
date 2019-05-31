import * as dgraph from 'dgraph-js';
import { ConnectionConfig } from './types';
export default class Connection {
    config: ConnectionConfig;
    clientStub: dgraph.DgraphClientStub;
    client: dgraph.DgraphClient;
    dgraph: any;
    constructor(config?: ConnectionConfig, logger?: Function);
    close(): void;
}
