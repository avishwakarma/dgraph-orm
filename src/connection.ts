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

/**
 * grpc
 * 
 * https://www.npmjs.com/package/grpc
 */
import * as grpc from 'grpc';

import { ConnectionConfig } from './types';

/**
 * _config
 * 
 * @type ConnectionConfig
 */
const _config: ConnectionConfig = {
  host: '127.0.0.1',
  port: 9080,
  debug: false,
  credentails: grpc.credentials.createInsecure()
}

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
  dgraph: any = dgraph;

  /**
   * constructor
   * @param config {ConnectionConfig}
   * @param logger {Function}
   */
  constructor(config: ConnectionConfig = {}, logger: Function = console.log) {

    this.config = {
      ..._config,
      ...config
    }

    try {
      this.clientStub = new dgraph.DgraphClientStub(
        `${this.config.host}:${this.config.port}`,
        this.config.credentails
      );
  
      this.client = new dgraph.DgraphClient(this.clientStub);
  
      if(this.config.debug) {
        this.client.setDebugMode(true);
      }
    } catch (error) {
      logger(error);
    }
  }

  /**
   * close
   * 
   * @retuns void
   */
  close(): void {
    this.clientStub.close();
  }
}