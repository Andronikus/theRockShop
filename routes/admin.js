const express = require("express");

const adminController = require("../controllers/admin");
const { isAuthenticated } = require("../middleware/isAuthenticated");

const route = express.Router();

route.get("/add-product", isAuthenticated, adminController.getAddProduct);
route.post("/add-product", isAuthenticated, adminController.postAddProduct);

route.get(
  "/edit-product/:productId",
  isAuthenticated,
  adminController.getEditProduct
);
route.post("/edit-product", isAuthenticated, adminController.postEditProduct);

route.post(
  "/delete-product",
  isAuthenticated,
  adminController.postDeleteProduct
);

route.get("/list-products", isAuthenticated, adminController.getProducts);

module.exports = route;
