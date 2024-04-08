const { encrypt, decrypt } = require('../../lib/encrypt-decrypt');
const _ = require('lodash');
const models = require('../../model-sql');
const Sequelize = models.Sequelize;
const Op = Sequelize.Op;

const MemberRepository = require('../../repository/member.repository');

const registerMember = async (dataRequest) => {
    try {
        console.log(`[member:registerMember] request=${JSON.stringify(dataRequest)} `);
        
        dataRequest.password = encrypt(dataRequest.password, 'password');
        dataRequest.status =  dataRequest.status ?  dataRequest.status : 'ACTIVE';
        dataRequest.created_at = new Date();
        dataRequest.created_by = null;
        dataRequest.updated_at = new Date();
        dataRequest.updated_by = null;
        dataRequest.deleted_at = null;
        dataRequest.deleted_by = null;

        const createMember = await MemberRepository.createMember(dataRequest);
        if(createMember){
            return {
                code: 1000,
                success: true,
                message: 'register_success',
                timestamp: new Date(),
                data: createMember,
            };
        }

        return {
            code: 5001,
            success: false,
            message: 'register_fail',
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

const getPurchaseHistory = async (dataRequest) => {
    try {

        if (_.isNull(dataRequest?.member_id)) {
            return {
                code: 5001,
                success: false,
                message: 'member_id_is_empty',
                timestamp: new Date(),
                data: null,
            };
        }

      
        let where = {};
        let dataSearch = {};
        dataSearch['deleted_at'] = { [Op.is]: null };
        dataSearch['member_id'] = { [Op.eq]: dataRequest?.member_id };

        where[Op.and] = {
            ...dataSearch,
        };
        let rows = await MemberRepository.getPurchaseHistory(where);
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

const memberDomain = {
    registerMember,
    getPurchaseHistory,
};

module.exports = memberDomain;