require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME, 
  process.env.DB_USER,
  process.env.DB_PASS, 
  {
    host: process.env.DB_HOST || 'db',
    dialect: 'postgres',
    port: process.env.DB_PORT, 
    logging: process.env.DB_LOGGING === 'true',
  }
);

module.exports = sequelize;




