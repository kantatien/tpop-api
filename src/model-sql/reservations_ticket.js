const tableName = `reservations_ticket`;
const modelName = `ReservationsTicketModel`;

module.exports = (sequelize, DataTypes) => {
    const ReservationsTicketModel = sequelize.define(
        modelName,
        {
            reservations_ticket_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
            },
            reservations_datetime: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            order_number: {
                type: DataTypes.STRING(255),
                allowNull: true,
            },
            member_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            seat_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            status: {
                type: DataTypes.STRING(255),
                allowNull: true,
                default: 'PENDING',
            },
            ///////////////////////////////
            // Start core column
            created_at: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            created_by: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            updated_at: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            updated_by: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            deleted_at: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            deleted_by: {
                type: DataTypes.STRING,
                allowNull: true,
            },
        },
        {
            timestamps: false,
            tableName: tableName,
            freezeTableName: true,
            underscored: true,
            paranoid: true,
        },
    );
    ReservationsTicketModel.associate = models => {
        models.ReservationsTicketModel.belongsTo(models.SeatModel, {
            as: 'seat_data',
            sourceKey: 'seat_id',
            foreignKey: 'seat_id',
            required: false,
            constraints: false,
          });

          models.ReservationsTicketModel.belongsTo(models.MemberModel, {
            as: 'member_data',
            sourceKey: 'member_id',
            foreignKey: 'member_id',
            required: false,
            constraints: false,
          });
    }


    return ReservationsTicketModel;
};
