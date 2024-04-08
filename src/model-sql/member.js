const tableName = `member`;
const modelName = `MemberModel`;

module.exports = (sequelize, DataTypes) => {
  const MemberModel = sequelize.define(
    modelName,
    {
      member_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      member_email: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      username: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      title: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      firstname: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      lastname: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      middlename: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      display_name: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      phone_number: {
        type: DataTypes.STRING(255),
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

  MemberModel.associate = models => {
    models.MemberModel.hasMany(models.ReservationsTicketModel, {
        as: 'purchase_history',
        sourceKey: 'member_id',
        foreignKey: 'member_id',
        required: false,
        constraints: false,
      });
}
  return MemberModel;
};
