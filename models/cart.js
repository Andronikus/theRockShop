const fs = require("fs");
const path = require("path");

const rootDir = require("../utils/path");

const cartPath = path.join(rootDir, "data", "cart.json");

module.exports = class Cart {
  static addProduct(product) {
    // read cart
    fs.readFile(cartPath, (err, data) => {
      let cart;

      console.log("Cart::addProduct:err", err);

      if (!err) {
        try {
          cart = JSON.parse(data);
        } catch (err) {
          cart = { products: [], totalPrice: 0.0 };
          console.log("Cart::addProduct:parse", err);
        }
      }
      const productIndexInCart = cart.products.findIndex(
        (p) => p.id === product.id
      );

      if (productIndexInCart >= 0) {
        // product already exists
        const productUpdated = {
          ...cart.products[productIndexInCart],
        };
        productUpdated.quantity += 1;
        cart.products[productIndexInCart] = productUpdated;
      } else {
        // new product is arriving
        const productsUpdated = [
          ...cart.products,
          { id: product.id, quantity: 1 },
        ];
        cart.products = productsUpdated;
      }
      cart.totalPrice += +product.price;

      fs.writeFile(cartPath, JSON.stringify(cart), (err) => console.log(err));
    });
  }

  static getProducts(callback) {
    fs.readFile(cartPath, (err, fileContent) => {
      if (err) {
        console.log("Cart::addProduct:getProducts", err);
        return callback(err, []);
      }

      if (!fileContent) {
        console.log("Cart::addProduct:getProducts - not fileContent");
        return callback(null, []);
      }

      return callback(null, JSON.parse(fileContent));
    });
  }

  static removeProduct(product) {
    fs.readFile(cartPath, (err, fileContent) => {
      if (!err) {
        const updatedCart = { ...JSON.parse(fileContent) };

        const removedProduct = updatedCart.products.find(
          (p) => p.id === product.id
        );

        if (removedProduct) {
          const updatedCartProducts = updatedCart.products.filter(
            (p) => p.id !== product.id
          );

          const updatedTotalPrice =
            updatedCart.totalPrice - removedProduct.quantity * product.price;

          updatedCart.products = updatedCartProducts;
          updatedCart.totalPrice = updatedTotalPrice;

          fs.writeFile(cartPath, JSON.stringify(updatedCart), (err) => {
            if (err) {
              console.log("Cart::removeProduct", err);
            }
          });
        }
      }
    });
  }
};
