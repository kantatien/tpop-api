const grpc = require('@grpc/grpc-js');

class GRPCPromise {
  client;

  constructor(grpcClient){
    this.client = grpcClient;
    // console.log(this.client);
  }

  call(method, req, meta = {}) {
    let metas = new grpc.Metadata();
    if (meta) {
      for (let key in meta) {
        metas.add(key, meta[key]);
      }
    }

    return new Promise((resolve, reject) => {
      this.client[method](req, metas, (err, res) => {
        if (err) reject(err);
        else resolve(res);
      });
    });
  }

  stream(service, method, req) {
    return this.client[service][method](req);
  }
}

module.exports = GRPCPromise;
