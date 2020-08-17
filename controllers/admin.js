const Product = require("../models/product");

const getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    docTitle: "Add Product",
    path: "/admin/add-product",
    docTitle: "Add Product",
    editMode: false,
  });
};

const getEditProduct = (req, res, next) => {
  const { productId } = req.params;
  const { edit } = req.query;

  Product.fetchById(productId)
    .then((product) => {
      res.render("admin/edit-product", {
        docTitle: "Edit Product",
        path: "/admin/edit-product",
        editMode: edit,
        product,
      });
    })
    .catch((err) => console.log(err));
};

const postEditProduct = (req, res, next) => {
  const { productId, title, imageUrl, price, description } = req.body;

  const product = new Product(title, price, imageUrl, description, productId);

  product
    .save()
    .then(() => res.redirect("/admin/list-products"))
    .catch((err) => console.log(err));
};

const postAddProduct = (req, res, next) => {
  const { title, imageUrl, price, description } = req.body;

  const product = new Product({
    title,
    price,
    imageUrl,
    description,
  });

  product
    .save()
    .then((result) => {
      res.redirect("/admin/list-products");
    })
    .catch((err) => console.log(err));
};

const getProducts = (req, res, next) => {
  Product.find()
    .then((products) => {
      res.render("admin/list-products", {
        products: products,
        docTitle: "Product List",
        path: "/admin/list-products",
      });
    })
    .catch((err) => console.log(err));
};

const postDeleteProduct = (req, res, next) => {
  const { productId } = req.body;

  Product.deleteById(productId)
    .then(() => {
      res.redirect("/admin/list-products");
    })
    .catch((err) => console.log(err));
};

module.exports = {
  getAddProduct,
  getEditProduct,
  postEditProduct,
  postAddProduct,
  getProducts,
  postDeleteProduct,
};
