require("dotenv").config();

const grpcEndpointConfig = {
  workspace: process.env.GRPC_ENDPOINT_WORKSPACE || "localhost:55003",
  authConsent: process.env.GRPC_ENDPOINT_AUTH_CONSENT || "localhost:55016",
  vam: process.env.GRPC_ENDPOINT_VAM || "localhost:55019",
};

module.exports = grpcEndpointConfig;
