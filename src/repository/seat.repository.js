const { SeatModel } = require('../model-sql');
const models = require('../model-sql');
const Sequelize = models.Sequelize;
const Op = Sequelize.Op;


const createSeat = async function (data) {
    try {

        const seat = SeatModel.build(data);
        const dataResponse = await seat.save();

        return dataResponse.dataValues;
    } catch (ex) {
        console.log(`[ERROR_CREATR_SEAT] error=${ex.message}`);
        throw ex;
    }
};


const updateSeat = async function (data) {
    try {
        // console.log(data)
        const isExistInDb = await SeatModel.findOne({
            where: {
                seat_id: data.seat_id,
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
        console.log(`[ERROR_CREATR_SEAT] error=${ex.message}`);
    }
};

const deleteSeat = async function (data) {
    try {
        const isExistInDb = await SeatModel.findOne({
            where: where,
        });
        if (isExistInDb) {
            isExistInDb.set(data);
            const dataResponse = await isExistInDb.save();

            return dataResponse.dataValues;
        }

        return null;
    } catch (ex) {
        console.log(`[ERROR_CREATR_SEAT] error=${ex.message}`);
    }
};

async function getListSeat(where, sort, offset, limit) {
    try {

        const seat = await SeatModel.findAndCountAll({
            where: where,
            searchPath: 'public',
            order: sort,
            offset: offset,
            limit: limit,
        });

        const rows = seat.rows.map(data => {
            data = data.get({ plain: true });

            return data;
        });

        return { count: seat.count, rows: rows };
    } catch (ex) {
        logger.e(`[ERROR] : ERROR=${JSON.stringify(ex.message)}`);
    }
}

async function getSeat(where) {
    try {
        let getItem = await SeatModel.findOne({
            where: where,
            searchPath: 'public',
        });
        getItem = getItem ? getItem.get({ plain: true }) : null;

        return getItem;
    } catch (ex) {
        logger.e(`[ERROR] : ERROR=${JSON.stringify(ex.message)}`);
    }
}

const SeatRepository = {
    createSeat,
    updateSeat,
    deleteSeat,
    getListSeat,
    getSeat,
};

module.exports = SeatRepository;