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

  Product.findByPk(productId)
    .then((product) => {
      if (!product) {
        return res.render("/");
      }

      res.render("admin/edit-product", {
        docTitle: "Edit Product",
        path: "/admin/edit-product",
        editMode: edit,
        product,
      });
    })
    .catch((error) => console.log(error));
};

const postEditProduct = (req, res, next) => {
  const { productId, title, imageUrl, price, description } = req.body;

  Product.findByPk(productId)
    .then((product) => {
      product.title = title;
      product.price = price;
      product.imageUrl = imageUrl;
      product.description = description;

      return product.save();
    })
    .then(() => {
      console.log("product updated successfully!");
      res.redirect("/admin/list-products");
    })
    .catch((error) => console.log(error));
};

const postAddProduct = (req, res, next) => {
  const { title, imageUrl, price, description } = req.body;

  Product.create({
    title,
    price,
    imageUrl,
    description,
  })
    .then(() => res.redirect("/admin/list-products"))
    .catch((error) => console.log(error));
};

const getProducts = (req, res, next) => {
  Product.findAll()
    .then((products) => {
      res.render("admin/list-products", {
        products: products,
        docTitle: "Product List",
        path: "/admin/list-products",
      });
    })
    .catch((error) => console.log(error));
};

const postDeleteProduct = (req, res, next) => {
  const { productId } = req.body;

  Product.findByPk(productId)
    .then((product) => product.destroy())
    .then(() => res.redirect("/admin/list-products"))
    .catch((error) => console.log(error));
};

module.exports = {
  getAddProduct,
  getEditProduct,
  postEditProduct,
  postAddProduct,
  getProducts,
  postDeleteProduct,
};
