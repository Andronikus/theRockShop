const fs = require("fs");
const path = require("path");

const Cart = require("./cart");

const rootDir = require("../utils/path");

const products = [];

const getProductsFromFile = (path, callback) => {
  fs.readFile(path, (err, data) => {
    if (err) {
      console.log("readFile", err);
      return callback([]);
    }

    return callback(JSON.parse(data));
  });
};

module.exports = class Product {
  constructor(id, title, imageUrl, price, description) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.price = price;
    this.description = description;
  }
  add() {
    const dataPath = path.join(rootDir, "data", "products.json");

    getProductsFromFile(dataPath, (products) => {
      if (this.id) {
        // update existing product
        const updateProductIndex = products.findIndex((p) => p.id === this.id);

        if (updateProductIndex >= 0) {
          const updateProducts = [...products];
          updateProducts[updateProductIndex] = this;
          fs.writeFile(dataPath, JSON.stringify(updateProducts), (err) => {
            console.log("add::write upd", err);
          });
        }
      } else {
        // add new product
        this.id = new Date().toJSON();
        products.push(this);

        fs.writeFile(dataPath, JSON.stringify(products), (err) => {
          console.log("add::write", err);
        });
      }
    });
  }

  static deleteById(id) {
    const dataPath = path.join(rootDir, "data", "products.json");

    getProductsFromFile(dataPath, (products) => {
      const removedProduct = products.find((p) => p.id === id);

      if (removedProduct) {
        Cart.removeProduct(removedProduct);
        const updatedProducts = products.filter((p) => p.id !== id);

        fs.writeFile(dataPath, JSON.stringify(updatedProducts), (err) => {
          if (!err) {
            console.log("Product::deleteById", err);
          }
        });
      }
    });
  }

  static fecthAll(callback) {
    const dataPath = path.join(rootDir, "data", "products.json");
    getProductsFromFile(dataPath, callback);
  }

  static findById(id, callback) {
    const dataPath = path.join(rootDir, "data", "products.json");
    getProductsFromFile(dataPath, (products) => {
      const product = products.find((p) => p.id === id);
      return callback(product);
    });
  }
};
