'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const config = require('../config/sequelize.config');
const db = {};
const _ = require('lodash');

let sequelize = new Sequelize(config.database, config.username, config.password, config);

fs.readdirSync(__dirname)
  .filter(file => {
    return file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js';
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.validateConnection = async () => {
  console.log(`\t\t-> Host=${config.host} Port=${config.port} Database=${config.database}`);
  const authResult = await sequelize.authenticate();
  let modelName = Object.keys(db).filter(name => {
    return !['sequelize', 'Sequelize', 'validateConnection'].includes(name);
  });
  console.log(`\t\t-> model :`);
  modelName.map(name => {
    console.log(`\t\t\t${name}`);
  });
  if (config.sync.toLowerCase() == 'yes') {
    await sequelize.sync({ alter: true });
    console.log(`\t\t-> [SEQUELIZE_SYNC] sequelize.sync({alter:true}) excuted`);
  }
  return authResult;
};

module.exports = db;
