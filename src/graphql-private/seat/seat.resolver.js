const _ = require("lodash");
const seatDomain = require('../../domain/seat/seat-domain');

const CreateSeat = async (req, header) => {
    const request = req || {};
    const metadata = header || {};

    return metadata.success ? await seatDomain.createSeat(req) : metadata;
}
const UpdateSeat = async (req, header) => {
    const request = req || {};
    const metadata = header || {};
    return metadata.success ? await seatDomain.updateSeat(req) : metadata;
}

const DeleteSeat = async (req, header) => {
    const request = req || {};
    const metadata = header || {};

    return metadata.success ? await seatDomain.deleteSeat(req) : metadata;
}

const GetSeatById = async (req, header) => {
    const request = req || {};
    const metadata = header || {};

    return metadata.success ? await seatDomain.getSeatById(req) : metadata;
}

const GetListSeat = async (req, header) => {
    const request = req || {};
    const metadata = header || {};

    return metadata.success ? await seatDomain.getListSeat(req) : metadata;
}



const resolvers = {
    Query: {
        GetSeatById: async (_, req, header) => await GetSeatById(req, header),
        GetListSeat: async (_, req, header) => await GetListSeat(req, header),
    },
    Mutation: {
        CreateSeat: async (_, req, header) => await CreateSeat(req, header),
        UpdateSeat: async (_, req, header) => await UpdateSeat(req, header),
        DeleteSeat: async (_, req, header) => await DeleteSeat(req, header),

    },
};

module.exports = resolvers;