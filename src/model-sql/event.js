const tableName = `event`;
const modelName = `EventModel`;

module.exports = (sequelize, DataTypes) => {
    const EventModel = sequelize.define(
        modelName,
        {
            event_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
            },
            event_name: {
                type: DataTypes.STRING(255),
                allowNull: true,
            },
            event_description: {
                type: DataTypes.STRING(255),
                allowNull: true,
            },
            event_location: {
                type: DataTypes.STRING(255),
                allowNull: true,
            },
            event_datetime: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            event_booking_datetime: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            image_url: {
                type: DataTypes.JSON,
                allowNull: true,
            },
            status: {
                type: DataTypes.STRING(255),
                allowNull: true,
                default: 'ACTIVE',
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

    EventModel.associate = models => {
        models.EventModel.hasMany(models.SeatModel, {
            as: 'seat',
            sourceKey: 'event_id',
            foreignKey: 'event_id',
            required: false,
            constraints: false,
          });
    }

    return EventModel;
};
