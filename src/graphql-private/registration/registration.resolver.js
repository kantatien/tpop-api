const _ = require("lodash");


const RegisterMember = (req, header) => {
    const request = req || {};
    const metadata = header || {};

    console.log(req)

    return "visitorGrpcClientPromise.call('RegisterMember', request, metadata)";
}
const resolvers = {
    Query: {
    },
    Mutation: {
        RegisterMember: async (_, req, header) => await RegisterMember(req, header),

    },
};

module.exports = resolvers;