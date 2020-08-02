const Product = require("../models/product");

const connectionPool = require("../utils/database");

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

  console.log(productId, edit);

  const product = Product.findById(productId, (product) => {
    if (!product) {
      return res.render("/");
    }

    res.render("admin/edit-product", {
      docTitle: "Edit Product",
      path: "/admin/edit-product",
      editMode: edit,
      product,
    });
  });
};

const postEditProduct = (req, res, next) => {
  const { productId, title, imageUrl, price, description } = req.body;

  const updateProduct = new Product(
    productId,
    title,
    imageUrl,
    price,
    description
  );
  updateProduct.add();

  res.redirect("/admin/list-products");
};

const postAddProduct = (req, res, next) => {
  const { title, imageUrl, price, description } = req.body;

  const product = new Product(null, title, imageUrl, price, description);
  product
    .add()
    .then(() => {
      res.redirect("/admin/list-products");
    })
    .catch((error) => console.log(error));
};

const getProducts = (req, res, next) => {
  Product.fecthAll()
    .then(([rows, dataFields]) => {
      res.render("admin/list-products", {
        products: rows,
        docTitle: "Product List",
        path: "/admin/list-products",
      });
    })
    .catch((error) => console.log(error));
};

const postDeleteProduct = (req, res, next) => {
  const { productId } = req.body;

  Product.deleteById(productId);

  res.redirect("/admin/list-products");
};

module.exports = {
  getAddProduct,
  getEditProduct,
  postEditProduct,
  postAddProduct,
  getProducts,
  postDeleteProduct,
};
