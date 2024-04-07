require('dotenv').config();

module.exports = {
  username: process.env.POSTGRES_USERNAME || '',
  password: process.env.POSTGRES_PASSWORD || '',
  database: process.env.POSTGRES_DATABASE || '',
  host: process.env.POSTGRES_HOST || 'localhost',
  port: process.env.POSTGRES_PORT || '5432',
  sync: process.env.SEQUELIZE_SYNC || 'NO',
  dialect: 'postgres',
  logging: false,
};
