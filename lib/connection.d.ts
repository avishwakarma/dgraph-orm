export default class Connection {
    config: any;
    clientStub: any;
    client: any;
    dgraph: any;
    constructor(config?: any, logger?: Function);
    close(): void;
}
