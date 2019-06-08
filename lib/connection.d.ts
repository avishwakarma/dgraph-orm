/**
 * Connection
 *
 * dgraph-orm Connection class
 *
 * @author Ashok Vishwakarma <akvlko@gmail.com>
 */
/**
 * dgraph
 *
 * https://www.npmjs.com/package/dgraph-js
 */
import * as dgraph from 'dgraph-js';
import { ConnectionConfig } from './types';
/**
 * Connection
 *
 * Connection class
 */
export default class Connection {
    /**
     * config
     *
     * @type ConnectionConfig
     */
    config: ConnectionConfig;
    /**
     * clientStub
     *
     * @type dgraph.DgraphClientStub
     */
    clientStub: dgraph.DgraphClientStub;
    /**
     * client
     *
     * @type dgraph.DgraphClient
     */
    client: dgraph.DgraphClient;
    /**
     * dgraph
     *
     * @type any
     */
    dgraph: any;
    /**
     * constructor
     * @param config {ConnectionConfig}
     * @param logger {Function}
     */
    constructor(config?: ConnectionConfig, logger?: Function);
    /**
     * close
     *
     * @retuns void
     */
    close(): void;
}
