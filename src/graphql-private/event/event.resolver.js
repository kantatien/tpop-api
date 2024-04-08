const _ = require("lodash");
const eventDomain = require('../../domain/event/event-domain');

const CreateEvent = async (req, header) => {
    const request = req || {};
    const metadata = header || {};

    return metadata.success ? await eventDomain.createEvent(req) : metadata;
}
const UpdateEvent = async (req, header) => {
    const request = req || {};
    const metadata = header || {};

    return metadata.success ? await eventDomain.updateEvent(req) : metadata;
}

const DeleteEvent = async (req, header) => {
    const request = req || {};
    const metadata = header || {};

    return metadata.success ? await eventDomain.deleteEvent(req) : metadata;
}

const GetEventById = async (req, header) => {
    const request = req || {};
    const metadata = header || {};

    return metadata.success ? await eventDomain.getEventById(req) : metadata;
}

const GetListEvent = async (req, header) => {
    const request = req || {};
    const metadata = header || {};

    return metadata.success ? await eventDomain.getListEvent(req) : metadata;
}



const resolvers = {
    Query: {
        GetEventById: async (_, req, header) => await GetEventById(req, header),
        GetListEvent: async (_, req, header) => await GetListEvent(req, header),
    },
    Mutation: {
        CreateEvent: async (_, req, header) => await CreateEvent(req, header),
        UpdateEvent: async (_, req, header) => await UpdateEvent(req, header),
        DeleteEvent: async (_, req, header) => await DeleteEvent(req, header),

    },
};

module.exports = resolvers;