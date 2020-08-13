const Sequelize = require("sequelize");

const { sequelize } = require("../utils/database");

const Cart = sequelize.define("cart", {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
});

module.exports = Cart;
