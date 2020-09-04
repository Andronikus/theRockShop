const express = require("express");
const { body } = require("express-validator");

const adminController = require("../controllers/admin");
const { isAuthenticated } = require("../middleware/isAuthenticated");

const route = express.Router();

route.get("/add-product", isAuthenticated, adminController.getAddProduct);
route.post(
  "/add-product",
  isAuthenticated,
  [
    body("title")
      .isString()
      .isLength({ min: 3 })
      .trim()
      .withMessage("Title should have at least 3 characters!"),
    // body("imageUrl").isURL().withMessage("Image URL is not a valid url!"),
    body("price")
      .isFloat({ gt: 0.0 })
      .withMessage("Price should be greater than 0"),
    body("description")
      .isString()
      .isLength({ min: 5 })
      .trim()
      .withMessage("Description should have at least 5 characters"),
  ],
  adminController.postAddProduct
);

route.get(
  "/edit-product/:productId",
  isAuthenticated,
  adminController.getEditProduct
);
route.post(
  "/edit-product",
  isAuthenticated,
  [
    body("title")
      .isString()
      .isLength({ min: 3 })
      .trim()
      .withMessage("Title should have at least 3 characters!"),
    body("imageUrl").isURL().withMessage("Image URL is not a valid url!"),
    body("price")
      .isFloat({ gt: 0.0 })
      .withMessage("Price shoud be greater than 0"),
    body("description")
      .isString()
      .isLength({ min: 5 })
      .trim()
      .withMessage("Description should have at least 5 characters"),
  ],
  adminController.postEditProduct
);

route.post(
  "/delete-product",
  isAuthenticated,
  adminController.postDeleteProduct
);

route.get("/list-products", isAuthenticated, adminController.getProducts);

module.exports = route;
