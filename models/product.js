const Cart = require("./cart");
const connectionPool = require("../utils/database");

module.exports = class Product {
  constructor(id, title, imageUrl, price, description) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.price = price;
    this.description = description;
  }

  add() {
    return connectionPool.execute(
      "INSERT INTO products(title, price, description, imageUrl) VALUES(?,?,?,?)",
      [this.title, this.price, this.description, this.imageUrl]
    );
  }

  static deleteById(id) {
    return connectionPool.execute(
      "DELETE FROM products WHERE products.id = ?",
      [id]
    );
  }

  static fecthAll() {
    return connectionPool.execute("SELECT * FROM products");
  }

  static findById(id) {
    return connectionPool.execute(
      "SELECT * FROM products WHERE products.id = ?",
      [id]
    );
  }
};
