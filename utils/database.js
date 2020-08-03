const Sequelize = require("sequelize");

const sequelize = new Sequelize("shop", "user", "password", {
  host: "localhost",
  dialect: "mysql",
});

module.exports = sequelize;
