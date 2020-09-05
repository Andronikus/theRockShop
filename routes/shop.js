const express = require("express");

const shopController = require("../controllers/shop");
const { isAuthenticated } = require("../middleware/isAuthenticated");

const route = express.Router();

route.get("/", shopController.getIndex);
route.get("/products", shopController.getProducts);
route.get("/products/:productId", shopController.getProduct);
route.get("/cart", isAuthenticated, shopController.getCart);
route.post("/cart", isAuthenticated, shopController.postAddProductToCart);
route.post(
  "/cart/delete-product",
  isAuthenticated,
  shopController.postRemoveProductFromCart
);
route.post("/create-order", isAuthenticated, shopController.postCreateOrder);
route.get("/orders", isAuthenticated, shopController.getOrders);
route.get("/orders/:orderId", isAuthenticated, shopController.getInvoice);

module.exports = route;
