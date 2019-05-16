import * as dgraph from 'dgraph-js';
import * as grpc from 'grpc';

const _config: any = {
  host: '127.0.0.1',
  port: 9080,
  debug: false,
  credentails: grpc.credentials.createInsecure()
}

export default class Connection {
  config: any;
  clientStub: any;
  client: any;

  constructor(config:any = {}, logger: Function = console.log) {

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

  close() {
    this.clientStub.close();
  }
}