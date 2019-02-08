const dgrpah = require('dgraph-js');
const grpc = require('grpc');

const _config = {
  host: '127.0.0.1',
  port: 9080,
  debug: false,
  credentails: grpc.credentials.createInsecure()
}

class Connection {
  constructor(config = {}) {
    this.config = {
      ..._config,
      ...config
    };

    this.clientStub = new dgrpah.DgraphClientStub(
      `${this.config.host}:${this.config.port}`,
      this.config.credentails
    );

    this.client = new dgrpah.DgraphClient(this.clientStub);

    if(this.config.debug) {
      this.client.setDebugMode(true);
    }

    return {
      ...dgrpah,
      client: this.client,
      close: this.close.bind(this)
    }
  }

  close() {
    this.clientStub.close();
  }
}

module.exports = Connection;