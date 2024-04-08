const tableName = `seat`;
const modelName = `SeatModel`;

module.exports = (sequelize, DataTypes) => {
    const SeatModel = sequelize.define(
        modelName,
        {
            seat_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
            },
            event_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            zone: {
                type: DataTypes.STRING(255),
                allowNull: true,
            },
            row: {
                type: DataTypes.STRING(255),
                allowNull: true,
            },
            seat_number: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            seat_status: {
                type: DataTypes.STRING(255),
                allowNull: true,
                default: 'AVAILABLE',
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

    SeatModel.associate = models => {
        models.SeatModel.belongsTo(models.EventModel, {
            as: 'event_data',
            sourceKey: 'event_id',
            foreignKey: 'event_id',
            required: false,
            constraints: false,
          });
    }

    return SeatModel;
};
