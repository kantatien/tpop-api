const EventRepository = require('../../repository/event.repository');
const _ = require('lodash');
const models = require('../../model-sql');
const Sequelize = models.Sequelize;
const Op = Sequelize.Op;

const createEvent = async (dataRequest) => {
    try {

        dataRequest.created_at = new Date();
        dataRequest.created_by = null;
        dataRequest.updated_at = new Date();
        dataRequest.updated_by = null;
        dataRequest.deleted_at = null;
        dataRequest.deleted_by = null;

        const createEvent = await EventRepository.createEvent(dataRequest);
        if (createEvent) {
            return {
                code: 1000,
                success: true,
                message: 'create_event_success',
                timestamp: new Date(),
                data: createEvent,
            };
        }

        return {
            code: 5001,
            success: false,
            message: 'create_event_fail',
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

const updateEvent = async (dataRequest) => {
    try {
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
        dataSearch['event_id'] = { [Op.eq]: dataRequest?.event_id };

        where[Op.and] = {
            ...dataSearch,
        };
        let rows = await EventRepository.getEvent(where);

        if (!rows) {
            return {
                code: 1000,
                success: true,
                message: 'evet_not_found',
                timestamp: new Date(),
                data: null,
            };
        }
        dataRequest = {
            ...rows,
            ...dataRequest,
        }

        dataRequest.updated_at = new Date();
        dataRequest.updated_by = null;

        let updateEvent = await EventRepository.updateEvent(dataRequest);
        if (updateEvent) {
            return {
                code: 1000,
                success: true,
                message: 'update_event_success',
                timestamp: new Date(),
                data: updateEvent,
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

const deleteEvent = async (dataRequest) => {
    try {


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
        dataSearch['event_id'] = { [Op.eq]: dataRequest?.event_id };

        where[Op.and] = {
            ...dataSearch,
        };
        let rows = await EventRepository.getEvent(where);
        if (!rows) {
            return {
                code: 1000,
                success: true,
                message: 'evet_not_found',
                timestamp: new Date(),
                data: null,
            };
        }
        dataRequest.deleted_at = new Date();
        dataRequest.deleted_by = null;

        let deleteEvent = await EventRepository.deleteEvent(dataRequest);
        if (deleteEvent) {
            return {
                code: 1000,
                success: true,
                message: 'delete_event_success',
                timestamp: new Date(),
                data: deleteEvent,
            };
        }
        return {
            code: 5001,
            success: false,
            message: 'delete_event_fail',
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

const getEventById = async (dataRequest) => {
    try {

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
        dataSearch['event_id'] = { [Op.eq]: dataRequest?.event_id };

        where[Op.and] = {
            ...dataSearch,
        };
        let rows = await EventRepository.getEvent(where);
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

const getListEvent = async (dataRequest) => {
    try {

        const startedDate = new Date(dataRequest?.filter_start_datetime);
        const endDate = new Date(dataRequest?.filter_end_datetime);

        if (!_.isEmpty(dataRequest?.filter_start_datetime) && !_.isEmpty(dataRequest?.filter_end_datetime)) {
            if (endDate.toString() === "Invalid Date" || startedDate.toString() === "Invalid Date") {
                return {
                    code: 5000,
                    success: false,
                    message: 'filter_start_datetime_or_filter_end_datetime_invalid_date',
                    timestamp: new Date(),
                    data: null,
                };
            }
        }

        let perPage = dataRequest.limit ? dataRequest?.limit : 10;

        let page = dataRequest?.page ? dataRequest?.page - 1 : 0;

        const offset = page * perPage;
        const limit = perPage;

        //========== set variable ==========
        const listEntity = ['event_name', 'event_description', 'event_location', 'status'];

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
            sort.push(['event_name', 'ASC']);
        }

        let where = {};
        let whereBy = {};
        let dataSearch = {};
        let dataSearchKey = {};

        dataSearch['deleted_at'] = { [Op.is]: null };

        if (!_.isEmpty(dataRequest?.filter_start_datetime) && !_.isEmpty(dataRequest?.filter_end_datetime)) {
            dataSearch[`event_datetime`] = { [Op.between]: [startedDate, endDate] };
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
                _listDataSearchKeyword = ['event_name'];
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

        const { count, rows } = await EventRepository.getListEvent(
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


const eventDomain = {
    createEvent,
    updateEvent,
    deleteEvent,
    getListEvent,
    getEventById,
};

module.exports = eventDomain;