const _ = require("lodash");
const reservationsTicketDomain = require('../../domain/reservations_ticket/reservations_ticket-domain');

const BookingTicket = async (req, header) => {
    const request = req || {};
    const metadata = header || {};

    return metadata.success ? await reservationsTicketDomain.bookingTicket(req) : metadata;
}
const resolvers = {
    Query: {
    },
    Mutation: {
        BookingTicket: async (_, req, header) => await BookingTicket(req, header),

    },
};

module.exports = resolvers;