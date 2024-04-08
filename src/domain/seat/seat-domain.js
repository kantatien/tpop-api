const SeatRepository = require('../../repository/seat.repository');
const _ = require('lodash');
const models = require('../../model-sql');
const Sequelize = models.Sequelize;
const Op = Sequelize.Op;

const createSeat = async (dataRequest) => {
    try {

        dataRequest.seat_status = dataRequest.seat_status ? dataRequest.seat_status : 'AVAILABLE';
        dataRequest.created_at = new Date();
        dataRequest.created_by = null;
        dataRequest.updated_at = new Date();
        dataRequest.updated_by = null;
        dataRequest.deleted_at = null;
        dataRequest.deleted_by = null;

        const createSeat = await SeatRepository.createSeat(dataRequest);
        if (createSeat) {
            return {
                code: 1000,
                success: true,
                message: 'create_event_success',
                timestamp: new Date(),
                data: createSeat,
            };
        }

        return {
            code: 5001,
            success: false,
            message: 'create_seat_fail',
            timestamp: new Date(),
            data: null,
        };

    } catch (ex) {
        return {
            code: 5001,
            success: false,
            message: ex,
            timestamp: new Date(),
            data: null,
        };
    }
};

const updateSeat = async (dataRequest) => {
    try {
        if (_.isNull(dataRequest?.seat_id)) {
            return {
                code: 5001,
                success: false,
                message: 'seat_id_is_empty',
                timestamp: new Date(),
                data: null,
            };
        }

        if (_.isNull(dataRequest?.event_id)) {
            return {
                code: 5001,
                success: false,
                message: 'event_id_is_empty',
                timestamp: new Date(),
                data: null,
            };
        }

        let where = {};
        let dataSearch = {};
        dataSearch['deleted_at'] = { [Op.is]: null };
        dataSearch['seat_id'] = { [Op.eq]: dataRequest?.seat_id };
        dataSearch['event_id'] = { [Op.eq]: dataRequest?.event_id };

        where[Op.and] = {
            ...dataSearch,
        };
        let rows = await SeatRepository.getSeat(where);

        if (!rows) {
            return {
                code: 1000,
                success: true,
                message: 'seat_not_found',
                timestamp: new Date(),
                data: null,
            };
        }

        dataRequest = {
            ...rows,
            ...dataRequest,
        }

        dataRequest.seat_status = dataRequest.seat_status ? dataRequest.seat_status : 'AVAILABLE';
        dataRequest.updated_at = new Date();
        dataRequest.updated_by = null;

        let updateSeat = await SeatRepository.updateSeat(dataRequest);
        if (updateSeat) {
            return {
                code: 1000,
                success: true,
                message: 'update_seat_success',
                timestamp: new Date(),
                data: updateSeat,
            };
        }

        return {
            code: 5001,
            success: false,
            message: 'update_event_fail',
            timestamp: new Date(),
            data: null,
        };
    } catch (ex) {
        return {
            code: 5001,
            success: false,
            message: ex,
            timestamp: new Date(),
            data: null,
        };
    }
};

const deleteSeat = async (dataRequest) => {
    try {

        if (_.isNull(dataRequest?.seat_id)) {
            return {
                code: 5001,
                success: false,
                message: 'seat_id_is_empty',
                timestamp: new Date(),
                data: null,
            };
        }

        let where = {};
        let dataSearch = {};
        dataSearch['deleted_at'] = { [Op.is]: null };
        if (dataRequest?.seat_id) {

            dataSearch['seat_id'] = { [Op.eq]: dataRequest?.seat_id };
        }

        where[Op.and] = {
            ...dataSearch,
        };
        let rows = await SeatRepository.getSeat(where);

        if (!rows) {
            return {
                code: 1000,
                success: true,
                message: 'seat_not_found',
                timestamp: new Date(),
                data: null,
            };
        }

        dataRequest.deleted_at = new Date();
        dataRequest.deleted_by = null;

        let deleteSeat = await SeatRepository.deleteSeat(dataRequest);
        if (deleteSeat) {
            return {
                code: 1000,
                success: true,
                message: 'delete_seat_success',
                timestamp: new Date(),
                data: deleteSeat,
            };
        }
        return {
            code: 5001,
            success: false,
            message: 'delete_seat_fail',
            timestamp: new Date(),
            data: null,
        };
    } catch (ex) {
        return {
            code: 5001,
            success: false,
            message: ex,
            timestamp: new Date(),
            data: null,
        };
    }
};

const getSeatById = async (dataRequest) => {
    try {


        if (_.isNull(dataRequest?.seat_id)) {
            return {
                code: 5001,
                success: false,
                message: 'seat_id_is_empty',
                timestamp: new Date(),
                data: null,
            };
        }

        let where = {};
        let dataSearch = {};
        dataSearch['deleted_at'] = { [Op.is]: null };
        if (dataRequest?.seat_id) {

            dataSearch['seat_id'] = { [Op.eq]: dataRequest?.seat_id };
        }

        where[Op.and] = {
            ...dataSearch,
        };
        let rows = await SeatRepository.getSeat(where);

        if (rows) {
            return {
                code: 1000,
                success: true,
                message: 'get_data_success',
                timestamp: new Date(),
                data: rows,
            };
        }

        return {
            code: 5001,
            success: false,
            message: 'get_data_fail',
            timestamp: new Date(),
            data: null,
        };
    } catch (ex) {
        return {
            code: 5001,
            success: false,
            message: ex,
            timestamp: new Date(),
            data: null,
        };
    }
};

const getListSeat = async (dataRequest) => {
    try {

        let perPage = dataRequest.limit ? dataRequest?.limit : 10;

        let page = dataRequest?.page ? dataRequest?.page - 1 : 0;

        const offset = page * perPage;
        const limit = perPage;

        //========== set variable ==========
        const listEntity = ['zone', 'row', 'seat_status'];

        //========== sort ==========
        let sort = [];
        if (_.isArray(dataRequest?.sort_by) && dataRequest?.sort_by.length > 0) {
            for (let item of dataRequest?.sort_by) {
                const listEntitySortBy = [...listEntity, 'created_at', 'updated_at', 'version'];

                const modelSortBy = listEntitySortBy.find(x => x === item.toLowerCase());

                if (modelSortBy) {
                    sort.push([`${modelSortBy}`, `${dataRequest?.sort}`]);
                }
            }
        } else {
            sort.push(['zone', 'ASC']);
        }

        let where = {};
        let whereBy = {};
        let dataSearch = {};
        let dataSearchKey = {};

        dataSearch['deleted_at'] = { [Op.is]: null };

        if (Array.isArray(dataRequest?.event_id)&& dataRequest?.event_id.length > 0){
            dataSearch[`event_id`] = { [Op.in]: dataRequest?.event_id };

        }

        let _listDataSearchKeyword = [];
        if (dataRequest?.search) {
            const listEntitySearchKeyword = [...listEntity];
            const search = dataRequest?.search;
            const search_field = dataRequest?.search_field;

            if (Array.isArray(search_field) && search_field.length > 0) {
                const mapSearchField = search_field.filter(x => {
                    const model = listEntitySearchKeyword.find(xEntity => xEntity === x.toLowerCase());
                    if (model) return true;
                    else return false;
                });

                if (mapSearchField.length > 0) {
                    _listDataSearchKeyword = [...mapSearchField];
                }
            } else {
                _listDataSearchKeyword = ['zone'];
            }

            for (let item of _listDataSearchKeyword) {

                dataSearchKey[item] = { [Op.iLike]: `%${search}%` };

            }

            if (dataSearchKey) {
                whereBy[Op.or] = dataSearchKey;
            }
        }

        where[Op.and] = {
            ...dataSearch,
            ...whereBy,
        };

        const { count, rows } = await SeatRepository.getListSeat(
            where,
            sort,
            offset,
            limit,
        );

        let total = Math.ceil(count / limit);
        const resMessage = count <= 0 ? `not_found_data` : `get_data_success`;
        const resCode = count <= 0 ? 5000 : 1000;
        const resSucess = count <= 0 ? false : true;

        return {
            code: resCode,
            success: resSucess,
            message: resMessage,
            data: rows,
            pagination: {
                page: dataRequest?.page,
                limit: limit,
                total_page: total,
                total_item: count,
            },
        };
    } catch (ex) {
        return {
            code: 5001,
            success: false,
            message: ex,
            timestamp: new Date(),
            data: null,
        };
    }
};


const seatDomain = {
    createSeat,
    updateSeat,
    deleteSeat,
    getSeatById,
    getListSeat,
};

module.exports = seatDomain;