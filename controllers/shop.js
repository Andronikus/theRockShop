const Product = require("../models/product");
const Cart = require("../models/cart");

const getProducts = (req, res, next) => {
  Product.findAll()
    .then((products) => {
      res.render("shop/product-list", {
        products: products,
        docTitle: "All products",
        path: "/products",
      });
    })
    .catch((error) => console.log(error));
};

const getProduct = (req, res, next) => {
  const { productId } = req.params;

  Product.findByPk(productId)
    .then((product) => {
      res.render("shop/product-details", {
        product,
        docTitle: product.title,
        path: "/products",
      });
    })
    .catch((error) => console.log(error));
};

const getIndex = (req, res, next) => {
  Product.findAll()
    .then((products) => {
      console.log(products);
      res.render("shop/index", {
        products: products,
        docTitle: "Shop",
        path: "/",
      });
    })
    .catch((error) => console.log(error));
};

const getCart = (req, res, next) => {
  // get cart associated with user
  req.user
    .getCart()
    .then((cart) => cart.getProducts())
    .then((products) => {
      let warningMessage;
      console.log("getCart:", products);
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

  let fetchedCart;

  req.user
    .getCart()
    .then((cart) => {
      fetchedCart = cart;
      return cart.getProducts();
    })
    .then((products) => {
      let product;
      if (products.lenght > 0) {
        product = products[0];
      }

      let newQuantity = 1;

      if (product) {
        //... product already in cart... need to increse quantity
      }

      // new product to cart
      Product.findByPk(productId).then((product) => {
        return fetchedCart.addProduct(product, {
          through: { quantity: newQuantity },
        });
      });
    })
    .then(() => res.redirect("/cart"))
    .catch((error) => console.log(error));
};

const postRemoveProductFromCart = (req, res, next) => {
  const { productId } = req.body;
  Product.findById(productId, (product) => {
    Cart.removeProduct(product);
    res.redirect("/cart");
  });
};

const getOrders = (req, res, next) => {
  res.render("shop/orders.ejs", {
    path: "/orders",
    docTitle: "Orders",
  });
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
  getCheckout,
  getOrders,
};
