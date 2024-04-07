const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const grpcServerConfig = require("../config/grpcserver.config");

const registerExampleGRPC = server => {
  const protoFilename = `example.proto`;
  const PROTO_PATH = `${__dirname}/../proto/${protoFilename}`;

  logger.i(`\t\tRegister : ${protoFilename}`);
  const examplePackageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  });

  function hello(call, callback) {
    callback(null, {
      code: 1,
      success: true,
      message: `message`,
      timestamp: new Date(),
    });
  }

  const exampleProto = grpc.loadPackageDefinition(examplePackageDefinition).com
    .sky.open.example;

  server.addService(exampleProto.ExampleService.service, {
    ExampleMessage: hello,
  });
};

const grpcServer = async function () {
  try {
    const server = new grpc.Server();

    // Register grpc here
    registerExampleGRPC(server);

    server.bindAsync(
      `${grpcServerConfig.host}:${grpcServerConfig.port}`,
      grpc.ServerCredentials.createInsecure(),
      () => {
        server.start();
      }
    );
  } catch (ex) {
    console.log(ex.stack);
  }
};

module.exports = grpcServer;
