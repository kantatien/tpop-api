const _ = require("lodash");
const memberDomain = require('../../domain/member/member-domain');

const RegisterMember = async (req, header) => {
    const request = req || {};
    const metadata = header || {};

    return metadata.success ? await memberDomain.registerMember(req) : metadata;
}
const GetPurchaseHistory = async (req, header) => {
    const request = req || {};
    const metadata = header || {};

    return metadata.success ? await memberDomain.getPurchaseHistory(req) : metadata;
}


const resolvers = {
    Query: {
        GetPurchaseHistory: async (_, req, header) => await GetPurchaseHistory(req, header),
    },
    Mutation: {
        RegisterMember: async (_, req, header) => await RegisterMember(req, header),

    },
};

module.exports = resolvers;