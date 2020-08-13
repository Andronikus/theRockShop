const express = require("express");

const shopController = require("../controllers/shop");

const route = express.Router();

route.get("/", shopController.getIndex);
route.get("/products", shopController.getProducts);
route.get("/products/:productId", shopController.getProduct);
// route.get("/cart", shopController.getCart);
// route.post("/cart", shopController.postAddProductToCart);
// route.post("/cart/delete-product", shopController.postRemoveProductFromCart);
// route.post("/create-order", shopController.postCreateOrder);
// route.get("/orders", shopController.getOrders);
// route.get("/checkout", shopController.getCheckout);

module.exports = route;
