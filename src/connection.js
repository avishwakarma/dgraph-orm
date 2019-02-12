const dgraph = require('dgraph-js');
const grpc = require('grpc');

const _config = {
  host: '127.0.0.1',
  port: 9080,
  debug: false,
  credentails: grpc.credentials.createInsecure()
}

class Connection {
  constructor(config = {}, logger) {
    this.config = {
      ..._config,
      ...config
    };

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

    return {
      dgraph: dgraph,
      client: this.client,
      close: this.close.bind(this)
    }
  }

  close() {
    this.clientStub.close();
  }
}

module.exports = Connection;