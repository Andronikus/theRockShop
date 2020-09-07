const fs = require("fs");
const path = require("path");

const Product = require("../models/product");
const Order = require("../models/order");

const NBR_PRODUTS_PER_PAGE = 4;

const getProducts = (req, res, next) => {
  Product.find()
    .then((products) => {
      res.render("shop/product-list", {
        products: products,
        docTitle: "All products",
        path: "/products",
        isAuthenticated: req.session.isAuthenticated,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.statusCode = 500;
      next(error);
    });
};

const getProduct = (req, res, next) => {
  const { productId } = req.params;

  Product.findById(productId)
    .then((product) => {
      res.render("shop/product-details", {
        product,
        docTitle: product.title,
        path: "/products",
        isAuthenticated: req.session.isAuthenticated,
      });
    })
    .catch((err) => {
      console.log(err);
      const error = new Error(err);
      error.statusCode = 500;
      next(error);
    });
};

const getIndex = (req, res, next) => {
  const page = req.query.page;
  Product.find()
    .skip((page - 1) * NBR_PRODUTS_PER_PAGE)
    .limit(NBR_PRODUTS_PER_PAGE)
    .then((products) => {
      res.render("shop/index", {
        products: products,
        docTitle: "Shop",
        path: "/",
        isAuthenticated: req.session.isAuthenticated,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.statusCode = 500;
      next(error);
    });
};

const getCart = (req, res, next) => {
  // get cart associated with user
  req.user
    .populate({ path: "cart.items.productId", select: "title" })
    .execPopulate()
    .then((user) => {
      let warningMessage;
      let products = [];
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
        isAuthenticated: req.session.isAuthenticated,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.statusCode = 500;
      next(error);
    });
};

const postAddProductToCart = (req, res, next) => {
  const { productId } = req.body;

  req.user
    .addToCart(productId)
    .then((result) => res.redirect("/cart"))
    .catch((err) => {
      const error = new Error(err);
      error.statusCode = 500;
      next(error);
    });
};

const postRemoveProductFromCart = (req, res, next) => {
  const { productId } = req.body;
  req.user
    .deleteProductFromCart(productId)
    .then((result) => res.redirect("/cart"))
    .catch((err) => {
      const error = new Error(err);
      error.statusCode = 500;
      next(error);
    });
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
          email: req.user.email,
        },
        products,
      });

      return newOrder.save();
    })
    .then((result) => req.user.clearCart())
    .then(() => res.redirect("/orders"))
    .catch((err) => {
      const error = new Error(err);
      error.statusCode = 500;
      next(error);
    });
};

const getOrders = (req, res, next) => {
  Order.find({ "user.userId": req.user }).then((orders) => {
    res.render("shop/orders.ejs", {
      path: "/orders",
      docTitle: "Orders",
      orders,
      isAuthenticated: req.session.isAuthenticated,
    });
  });
};

const getInvoice = (req, res, next) => {
  const orderId = req.params.orderId;
  const invoiceName = `invoice-${orderId}.pdf`;

  Order.findById(orderId)
    .then((orderDoc) => {
      if (!orderDoc) {
        return res.redirect("/orders");
      }

      if (orderDoc.user.userId.toString() !== req.user._id.toString()) {
        return res.status(403).redirect("/orders");
      }
      const readStream = fs.createReadStream(
        path.join("data/invoices", invoiceName)
      );

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        'inline; filename="' + invoiceName + '"'
      );
      // every chunck of file is forward to the res writable stream
      // advantage for big files, only a chunck of memory will be allocated and not memory for all file before send
      // the response!
      readStream.pipe(res);
    })
    .catch((err) => next(err));
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
  getInvoice,
};
