const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql", // Change this if you're using PostgreSQL, SQLite, etc.
    logging: false, // Disable logging for cleaner output
  }
);

module.exports = sequelize;
