const { EventModel, SeatModel } = require('../model-sql');
const models = require('../model-sql');
const Sequelize = models.Sequelize;
const Op = Sequelize.Op;


const createEvent = async function (data) {
    try {

        const event = EventModel.build(data);
        const dataResponse = await event.save();

        return dataResponse.dataValues;
    } catch (ex) {
        console.log(`[ERROR_CREATR_EVENT] error=${ex.message}`);
        throw ex;
    }
};


const updateEvent = async function (data) {
    try {
        const isExistInDb = await EventModel.findOne({
            where: {
                event_id: data.event_id,
                deleted_at: null,
            },
        });
        if (isExistInDb) {
            isExistInDb.set(data);
            const dataResponse = await isExistInDb.save();

            return dataResponse.dataValues;
        }

        return null;
    } catch (ex) {
        console.log(`[ERROR_CREATR_EVENT] error=${ex.message}`);
    }
};

const deleteEvent = async function (data) {
    try {
        const isExistInDb = await EventModel.findOne({
            where: {
                event_id: data.event_id,
                deleted_at: null,
            },
        });
        if (isExistInDb) {
            isExistInDb.set(data);
            const dataResponse = await isExistInDb.save();

            return dataResponse.dataValues;
        }

        return null;
    } catch (ex) {
        console.log(`[ERROR_CREATR_EVENT] error=${ex.message}`);
    }
};


async function getListEvent(where, sort, offset, limit) {
    try {

        const event = await EventModel.findAndCountAll({
            where: where,
            include: [
                {
                    model: SeatModel,
                    as: 'seat',
                    required: false,
                    where: {
                        deleted_at: null,
                    },
                },
            ],
            searchPath: 'public',
            order: sort,
            offset: offset,
            limit: limit,
        });

        const rows = event.rows.map(data => {
            data = data.get({ plain: true });
            data.total_number_of_seats = data.seat.length
            return data;
        });

        return { count: event.count, rows: rows };
    } catch (ex) {
        logger.e(`[ERROR] : ERROR=${JSON.stringify(ex.message)}`);
    }
}



async function getEvent(where) {
    try {
        let getItem = await EventModel.findOne({
            where: where,
            include: [
                {
                    model: SeatModel,
                    as: 'seat',
                    required: false,
                    where: {
                        deleted_at: null,
                    },
                },
            ],
            searchPath: 'public',
        });
        getItem = getItem ? getItem.get({ plain: true }) : null;
        if(getItem){
            getItem.total_number_of_seats = getItem.seat.length
        }

        return getItem;
    } catch (ex) {
        logger.e(`[ERROR] : ERROR=${JSON.stringify(ex.message)}`);
    }
}




const EventRepository = {
    createEvent,
    updateEvent,
    deleteEvent,
    getListEvent,
    getEvent,
};

module.exports = EventRepository;