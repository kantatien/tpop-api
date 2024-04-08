const ReservationsTicketRepository = require('../../repository/reservations_ticket.repository');
const SeatRepository = require('../../repository/seat.repository');
const ShortUniqueId = require('short-unique-id');
const uid = new ShortUniqueId();
const _ = require('lodash');
const models = require('../../model-sql');
const Sequelize = models.Sequelize;
const Op = Sequelize.Op;

const bookingTicket = async (dataRequest) => {
    try {
        let where = {};
        let dataSearch = {};
        dataSearch['deleted_at'] = { [Op.is]: null };
        dataSearch['seat_id'] = { [Op.eq]: dataRequest?.seat_id };

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

        if (rows?.seat_status === 'RESERVED') {
            return {
                code: 1000,
                success: true,
                message: 'seat_is_not_available',
                timestamp: new Date(),
                data: null,
            };
        }

        dataRequest.reservations_datetime = new Date();
        dataRequest.order_number = await generateOrderNmber(10);
        dataRequest.status = dataRequest.status ? dataRequest.status : 'PENDING';
        dataRequest.created_at = new Date();
        dataRequest.created_by = null;
        dataRequest.updated_at = new Date();
        dataRequest.updated_by = null;
        dataRequest.deleted_at = null;
        dataRequest.deleted_by = null;
        const booking = await ReservationsTicketRepository.createReservations(dataRequest);

        if (booking) {
            console.log("ddfsogfkds")
            let updateSeatStatus = {};
            updateSeatStatus.seat_id = dataRequest.seat_id;
            updateSeatStatus.seat_status = 'RESERVED';
            updateSeatStatus.updated_at = new Date();
            updateSeatStatus.updated_by = null;

            let updateSeat = await SeatRepository.updateSeat(updateSeatStatus);

            if (updateSeat) {


                let where = {};
                let dataSearch = {};
                dataSearch['deleted_at'] = { [Op.is]: null };
                dataSearch['reservations_ticket_id'] = { [Op.eq]: booking?.reservations_ticket_id };

                where[Op.and] = {
                    ...dataSearch,
                };
                let rows = await ReservationsTicketRepository.getReservations(where);
                if(rows){
                    return {
                        code: 1000,
                        success: true,
                        message: 'booking_success',
                        timestamp: new Date(),
                        data: rows,
                    };
                }
            }
        }
        return {
            code: 5001,
            success: false,
            message: 'booking_fail',
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


const generateOrderNmber = async (n) => {
    let orderNumber = "";
    let isAvailable = false;
    do {
        uid.setDictionary('number');
        orderNumber = ` 1${uid.rnd(n)}`;

        let where = {};
        let dataSearch = {};
        dataSearch['deleted_at'] = { [Op.is]: null };
        dataSearch['order_number'] = { [Op.eq]: orderNumber.toString() };

        where[Op.and] = {
            ...dataSearch,
        };
        let rows = await ReservationsTicketRepository.checkReservations(where);

        if (_.isEmpty(rows)) {
            isAvailable = true
        } else {
            isAvailable = false
        }
    } while (!isAvailable);

    return orderNumber.toString();
}


const reservationsTicketDomain = {
    bookingTicket,
};

module.exports = reservationsTicketDomain;