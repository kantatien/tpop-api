const { EventModel, SeatModel, ReservationsTicketModel,MemberModel } = require('../model-sql');
const models = require('../model-sql');
const Sequelize = models.Sequelize;
const Op = Sequelize.Op;

const createReservations = async function (data) {
    try {

        const reservations = ReservationsTicketModel.build(data);
        const dataResponse = await reservations.save();

        return dataResponse.dataValues;
    } catch (ex) {
        console.log(`[ERROR_CREATR_EVENT] error=${ex.message}`);
        throw ex;
    }
};


async function checkReservations(where) {
    try {
        let getItem = await ReservationsTicketModel.findOne({
            where: where,
            searchPath: 'public',
        });
        getItem = getItem ? getItem.get({ plain: true }) : null;

        return getItem;
    } catch (ex) {
        logger.e(`[ERROR] : ERROR=${JSON.stringify(ex.message)}`);
    }
}


async function getListReservations(where, sort, offset, limit) {
    try {

        const reservations = await ReservationsTicketModel.findAndCountAll({
            where: where,
            include: [
                {
                    model: SeatModel,
                    as: 'seat_data',
                    required: false,
                    where: {
                        deleted_at: null,
                    },
                    include: [
                        {
                            model: EventModel,
                            as: 'event_data',
                            required: false,
                            where: {
                                deleted_at: null,
                            },
                        }
                    ]
                },
                {
                    model: MemberModel,
                    as: 'member_data',
                    required: false,
                    where: {
                        deleted_at: null,
                    }
                },
            ],
            searchPath: 'public',
            order: sort,
            offset: offset,
            limit: limit,
        });

        const rows = reservations.rows.map(data => {
            data = data.get({ plain: true });
            return data;
        });

        return { count: reservations.count, rows: rows };
    } catch (ex) {
        logger.e(`[ERROR] : ERROR=${JSON.stringify(ex.message)}`);
    }
}


async function getReservations(where) {
    try {
        let getItem = await ReservationsTicketModel.findOne({
            where: where,
            include: [
                {
                    model: SeatModel,
                    as: 'seat_data',
                    required: false,
                    where: {
                        deleted_at: null,
                    },
                    include: [
                        {
                            model: EventModel,
                            as: 'event_data',
                            required: false,
                            where: {
                                deleted_at: null,
                            },
                        }
                    ]
                },
                {
                    model: MemberModel,
                    as: 'member_data',
                    required: false,
                    where: {
                        deleted_at: null,
                    }
                },
            ],
            searchPath: 'public',
        });
        getItem = getItem ? getItem.get({ plain: true }) : null;

        return getItem;
    } catch (ex) {
        logger.e(`[ERROR] : ERROR=${JSON.stringify(ex.message)}`);
    }
}

const ReservationsTicketRepository = {
    createReservations,
    checkReservations,
    getListReservations,
    getReservations,
};

module.exports = ReservationsTicketRepository;