const { EventModel, SeatModel, ReservationsTicketModel, MemberModel } = require('../model-sql');
const models = require('../model-sql');
const Sequelize = models.Sequelize;
const Op = Sequelize.Op;


const createMember = async function (data) {
    try {

        const member = MemberModel.build(data);
        const dataResponse = await member.save();

        return dataResponse.dataValues;
    } catch (ex) {
        console.log(`[ERROR_CREATR_MEMBER] error=${ex.message}`);
        throw ex;
    }
};



async function getPurchaseHistory(where) {
    try {
        let getItem = await MemberModel.findOne({
            where: where,
            include: [
                {
                    model: ReservationsTicketModel,
                    as: 'purchase_history',
                    required: false,
                    where: {
                        deleted_at: null,
                    },
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
                    ]
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

const MemberRepository = {
    createMember,
    getPurchaseHistory,
};

module.exports = MemberRepository;