const Product = require("../models/product");
const Order = require("../models/order");

const logError = require("../utils/log");

const getProducts = (req, res, next) => {
  Product.find()
    .then((products) => {
      res.render("shop/product-list", {
        products: products,
        docTitle: "All products",
        path: "/products",
      });
    })
    .catch(logError);
};

const getProduct = (req, res, next) => {
  const { productId } = req.params;

  Product.fetchById(productId)
    .then((product) => {
      res.render("shop/product-details", {
        product,
        docTitle: product.title,
        path: "/products",
      });
    })
    .catch(logError);
};

const getIndex = (req, res, next) => {
  Product.find()
    .then((products) => {
      res.render("shop/index", {
        products: products,
        docTitle: "Shop",
        path: "/",
      });
    })
    .catch(logError);
};

const getCart = (req, res, next) => {
  // get cart associated with user
  req.user
    .populate({ path: "cart.items.productId", select: "title" })
    .execPopulate()
    .then((user) => {
      let warningMessage;
      let products = [];

      console.log("getCart", user.cart.items);
      if (
        user &&
        user.cart &&
        user.cart.items &&
        user.cart.items.length === 0
      ) {
        warningMessage = "Cart is empty!";
      } else {
        products = user.cart.items;
      }

      res.render("shop/cart.ejs", {
        path: "/cart",
        docTitle: "Cart",
        products: products,
        warningMessage,
      });
    })
    .catch((error) => console.log(error));
};

const postAddProductToCart = (req, res, next) => {
  const { productId } = req.body;

  req.user
    .addToCart(productId)
    .then((result) => res.redirect("/cart"))
    .catch(logError);
};

const postRemoveProductFromCart = (req, res, next) => {
  const { productId } = req.body;
  req.user
    .deleteProductFromCart(productId)
    .then((result) => res.redirect("/cart"))
    .catch(logError);
};

const postCreateOrder = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .execPopulate()
    .then((user) => {
      const products = user.cart.items.map((item) => {
        return { product: { ...item.productId._doc }, quantity: item.quantity };
      });

      const newOrder = new Order({
        user: {
          userId: req.user,
          name: req.user.name,
        },
        products,
      });

      return newOrder.save();
    })
    .then((result) => req.user.clearCart())
    .then(() => res.redirect("/orders"))
    .catch(logError);
};

const getOrders = (req, res, next) => {
  Order.find({ "user.userId": req.user }).then((orders) => {
    res.render("shop/orders.ejs", {
      path: "/orders",
      docTitle: "Orders",
      orders,
    });
  });
};

module.exports = {
  getProducts,
  getProduct,
  getIndex,
  getCart,
  postAddProductToCart,
  postRemoveProductFromCart,
  postCreateOrder,
  getOrders,
};
