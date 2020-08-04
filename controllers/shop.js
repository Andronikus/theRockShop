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
      res.render("shop/index", {
        products: products,
        docTitle: "Shop",
        path: "/",
      });
    })
    .catch((error) => console.log(error));
};

const getCart = (req, res, next) => {
  Cart.getProducts((err, cart) => {
    if (err || !cart || cart.products.length === 0) {
      const message =
        cart.products.length === 0
          ? "Cart is empty!"
          : "Ops! Something went wrong";

      return res.render("shop/cart.ejs", {
        path: "/cart",
        docTitle: "Cart",
        products: [],
        warningMessage: message,
      });
    }
    Product.fecthAll((products) => {
      let cartProducts = [];
      const productsFromCart = cart.products;

      for (productInCart of productsFromCart) {
        const product = products.find((p) => p.id === productInCart.id);

        const productToShow = {
          ...product,
          quantity: productInCart.quantity,
        };
        cartProducts.push(productToShow);
      }

      res.render("shop/cart.ejs", {
        path: "/cart",
        docTitle: "Cart",
        products: cartProducts,
      });
    });
  });
};

const postAddProductToCart = (req, res, next) => {
  const { productId } = req.body;

  const product = Product.findById(productId, (product) => {
    Cart.addProduct(product);
    res.redirect("/cart");
  });
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
