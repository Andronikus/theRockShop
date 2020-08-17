const Product = require("../models/product");
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
    .getCart()
    .then((products) => {
      let warningMessage;
      if (products.length === 0) {
        warningMessage = "Cart is empty!";
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

  Product.fetchById(productId)
    .then((product) => {
      return req.user.addToCart(product);
    })
    .then((result) => {
      res.redirect("/cart");
    })
    .catch(logError);
};

const postRemoveProductFromCart = (req, res, next) => {
  const { productId } = req.body;
  req.user
    .deleteProductFromCart(productId)
    .then((result) => res.redirect("/orders"))
    .catch(logError);
};

const postCreateOrder = (req, res, next) => {
  let fetchedCart;

  req.user
    .createOrder()
    .then((result) => {
      res.redirect("/orders");
    })
    .catch(logError);
  // req.user
  //   .getCart()
  //   .then((cart) => {
  //     fetchedCart = cart;
  //     return cart.getProducts();
  //   })
  //   .then((products) => {
  //     return req.user
  //       .createOrder()
  //       .then((order) => {
  //         const orderProducts = products.map((product) => {
  //           product.orderItem = {
  //             quantity: product.cartItem.quantity,
  //           };
  //           return product;
  //         });

  //         return order.addProducts(orderProducts);
  //       })
  //       .catch((error) => console.log(error));
  //   })
  //   .then(() => {
  //     return fetchedCart.setProducts(null);
  //   })
  //   .then(() => {
  //     res.redirect("/orders");
  //   })
  //   .catch((error) => console.log(error));
};

const getOrders = (req, res, next) => {
  req.user
    .getOrders()
    .then((orders) => {
      res.render("shop/orders.ejs", {
        path: "/orders",
        docTitle: "Orders",
        orders,
      });
    })
    .catch((error) => console.log(error));
};

const getCheckout = (req, res, next) => {
  res.render("shop/checkout.ejs", {
    path: "/checkout",
    docTitle: "Checkout",
  });
};

module.exports = {
  getProducts,
  getProduct,
  getIndex,
  getCart,
  postAddProductToCart,
  postRemoveProductFromCart,
  // getCheckout,
  postCreateOrder,
  getOrders,
};
