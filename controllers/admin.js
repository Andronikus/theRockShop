const { validationResult } = require("express-validator");
const path = require("path");

const Product = require("../models/product");
const { getValidationErrorObj } = require("../utils/validation");
const rootDir = require("../utils/path");

const getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    docTitle: "Add Product",
    path: "/admin/add-product",
    docTitle: "Add Product",
    editMode: false,
    hasErrors: false,
    errorMessage: "",
    validationErrors: {},
    oldInputInfo: {},
    isAuthenticated: req.session.isAuthenticated,
  });
};

const postAddProduct = (req, res, next) => {
  const { title, price, description } = req.body;
  const imageFile = req.file;

  console.log(imageFile);

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const validationErrors = getValidationErrorObj(errors);

    return res.status(402).render("admin/edit-product", {
      docTitle: "Add Product",
      path: "/admin/add-product",
      docTitle: "Add Product",
      editMode: false,
      hasErrors: true,
      errorMessage: errors.array()[0].msg,
      validationErrors: validationErrors,
      product: {
        title,
        imageUrl,
        price,
        description,
      },
    });
  }

  if (!imageFile) {
    return res.status(402).render("admin/edit-product", {
      docTitle: "Add Product",
      path: "/admin/add-product",
      docTitle: "Add Product",
      editMode: false,
      hasErrors: true,
      errorMessage: "Please submit a valid product image",
      validationErrors: {},
      product: {
        title,
        price,
        description,
      },
    });
  }

  const product = new Product({
    title,
    price,
    imageUrl: path.join("images", imageFile.filename),
    description,
    userId: req.user,
  });

  product
    .save()
    .then((result) => {
      res.redirect("/admin/list-products");
    })
    .catch((err) => {
      const error = new Error(err);
      error.statusCode = 500;
      next(error);
    });
};

const getEditProduct = (req, res, next) => {
  const { productId } = req.params;
  const { edit } = req.query;

  Product.findById(productId)
    .then((product) => {
      res.render("admin/edit-product", {
        docTitle: "Edit Product",
        path: "/admin/edit-product",
        editMode: edit,
        hasErrors: false,
        errorMessage: "",
        validationErrors: {},
        product,
        isAuthenticated: req.session.isAuthenticated,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.statusCode = 500;
      next(error);
    });
};

const postEditProduct = (req, res, next) => {
  const { productId, title, price, description } = req.body;
  const imageFile = req.file;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const validationErrors = getValidationErrorObj(errors);

    return res.status(402).render("admin/edit-product", {
      docTitle: "Add Product",
      path: "/admin/edit-product",
      docTitle: "Edit Product",
      editMode: true,
      hasErrors: true,
      errorMessage: errors.array()[0].msg,
      validationErrors: validationErrors,
      product: {
        title,
        price,
        description,
        _id: productId,
      },
      isAuthenticated: req.session.isAuthenticated,
    });
  }

  Product.findById(productId)
    .then((product) => {
      product.title = title;

      if (imageFile) {
        product.imageUrl = path.join("images", imageFile.filename);
      }
      product.price = price;
      product.description = description;

      return product.save();
    })
    .then((result) => res.redirect("/admin/list-products"))
    .catch((err) => {
      const error = new Error(err);
      error.statusCode = 500;
      next(error);
    });
};

const getProducts = (req, res, next) => {
  Product.find()
    .then((products) => {
      res.render("admin/list-products", {
        products: products,
        docTitle: "Product List",
        path: "/admin/list-products",
        isAuthenticated: req.session.isAuthenticated,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.statusCode = 500;
      next(error);
    });
};

const postDeleteProduct = (req, res, next) => {
  const { productId } = req.body;

  Product.findByIdAndDelete(productId)
    .then(() => {
      res.redirect("/admin/list-products");
    })
    .catch((err) => {
      const error = new Error(err);
      error.statusCode = 500;
      next(error);
    });
};

module.exports = {
  getAddProduct,
  getEditProduct,
  postEditProduct,
  postAddProduct,
  getProducts,
  postDeleteProduct,
};
