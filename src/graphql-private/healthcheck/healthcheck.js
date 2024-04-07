const healthcheck = () => {
  return {
    code: 1000,
    success: true,
    message: `good`,
    timestamp: new Date(),
  }
}
const resolvers = {
  Query: {
    HealthCheck: () => healthcheck(),
  }, 
};


module.exports = resolvers;