const Product = require("../models/product");
// const Cart = require("../models/cart");

const getProducts = (req, res, next) => {
  Product.fetchAll()
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

  Product.fetchById(productId)
    .then((product) => {
      res.render("shop/product-details", {
        product,
        docTitle: product.title,
        path: "/products",
      });
    })
    .catch((err) => console.log(err));
};

const getIndex = (req, res, next) => {
  Product.fetchAll()
    .then((products) => {
      res.render("shop/index", {
        products: products,
        docTitle: "Shop",
        path: "/",
      });
    })
    .catch((error) => console.log(error));
};

// const getCart = (req, res, next) => {
//   // get cart associated with user
//   req.user
//     .getCart()
//     .then((cart) => cart.getProducts())
//     .then((products) => {
//       let warningMessage;
//       if (products.length === 0) {
//         warningMessage = "Cart is empty!";
//       }

//       res.render("shop/cart.ejs", {
//         path: "/cart",
//         docTitle: "Cart",
//         products: products,
//         warningMessage,
//       });
//     })
//     .catch((error) => console.log(error));
// };

// const postAddProductToCart = (req, res, next) => {
//   const { productId } = req.body;

//   let fetchedCart;
//   let newQuantity = 1;

//   req.user
//     .getCart()
//     .then((cart) => {
//       fetchedCart = cart;
//       return cart.getProducts({ where: { id: productId } });
//     })
//     .then((products) => {
//       let product;

//       if (products.length > 0) {
//         product = products[0];
//       }
//       console.log("postAddProductToCart:products.lenght ", products.lenght);
//       if (product) {
//         //... product already in cart... need to increse quantity

//         const oldQuantity = product.cartItem.quantity;
//         console.log("oldQuantity: ", oldQuantity);
//         newQuantity = oldQuantity + 1;
//         return product;
//       }
//       // new product to cart
//       return Product.findByPk(productId);
//     })
//     .then((product) => {
//       return fetchedCart.addProduct(product, {
//         through: { quantity: newQuantity },
//       });
//     })
//     .then(() => res.redirect("/cart"))
//     .catch((error) => console.log(error));
// };

// const postRemoveProductFromCart = (req, res, next) => {
//   const { productId } = req.body;

//   req.user
//     .getCart()
//     .then((cart) => {
//       return cart.getProducts({ where: { id: productId } });
//     })
//     .then((products) => {
//       let product;
//       if (products.length > 0) {
//         product = products[0];
//       }

//       if (product) {
//         return product.cartItem.destroy();
//       }
//       return null;
//     })
//     .then((result) => res.redirect("/cart"))
//     .catch((error) => console.log(error));
// };

// const postCreateOrder = (req, res, next) => {
//   let fetchedCart;

//   req.user
//     .getCart()
//     .then((cart) => {
//       fetchedCart = cart;
//       return cart.getProducts();
//     })
//     .then((products) => {
//       return req.user
//         .createOrder()
//         .then((order) => {
//           const orderProducts = products.map((product) => {
//             product.orderItem = {
//               quantity: product.cartItem.quantity,
//             };
//             return product;
//           });

//           return order.addProducts(orderProducts);
//         })
//         .catch((error) => console.log(error));
//     })
//     .then(() => {
//       return fetchedCart.setProducts(null);
//     })
//     .then(() => {
//       res.redirect("/orders");
//     })
//     .catch((error) => console.log(error));
// };

// const getOrders = (req, res, next) => {
//   req.user
//     .getOrders({ include: Product })
//     .then((orders) => {
//       res.render("shop/orders.ejs", {
//         path: "/orders",
//         docTitle: "Orders",
//         orders,
//       });
//     })
//     .catch((error) => console.log(error));
// };

// const getCheckout = (req, res, next) => {
//   res.render("shop/checkout.ejs", {
//     path: "/checkout",
//     docTitle: "Checkout",
//   });
// };

module.exports = {
  getProducts,
  getProduct,
  getIndex,
  // getCart,
  // postAddProductToCart,
  // postRemoveProductFromCart,
  // getCheckout,
  // postCreateOrder,
  // getOrders,
};
