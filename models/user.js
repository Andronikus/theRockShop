const { ObjectID, ObjectId } = require("mongodb");

const getDB = require("../utils/database").getDB;

const USER_COLLECTION = "users";
const PRODUCT_COLLECTION = "products";
const ORDER_COLLECTION = "orders";

class User {
  constructor(name, email, cart, id) {
    this.name = name;
    this.email = email;
    this.cart = cart;
    this.id = id;
  }

  save() {
    return getDB()
      .collection(USER_COLLECTION)
      .insertOne({ name: this.name, email: this.email });
  }

  // {
  //   name: <name>,
  //   email: email,
  //   cart: {items:[{productId: hhh, quantity: 5}]}
  // }

  addToCart(product) {
    let productInCartIndex = -1;
    let updatedItems = [];

    if (this.cart) {
      updatedItems = [...this.cart.items];
      productInCartIndex = updatedItems.findIndex((item) => {
        return item.productId.toString() === product._id.toString();
      });
    }

    if (productInCartIndex >= 0) {
      // update quantity
      updatedItems[productInCartIndex].quantity++;
    } else {
      updatedItems.push({ productId: new ObjectID(product._id), quantity: 1 });
    }

    return getDB()
      .collection(USER_COLLECTION)
      .updateOne(
        { _id: ObjectID(this.id) },
        { $set: { cart: { items: updatedItems } } }
      );
  }

  getCart() {
    let cartProducItems = [];
    if (this.cart) {
      cartProducItems = this.cart.items.map((item) => item.productId);
    }

    // get products from product collection
    return getDB()
      .collection(PRODUCT_COLLECTION)
      .find({ _id: { $in: cartProducItems } })
      .toArray()
      .then((products) => {
        return products.map((product) => {
          const quantity = this.cart.items.find(
            (item) => item.productId.toString() === product._id.toString()
          ).quantity;
          return {
            ...product,
            quantity,
          };
        });
      })
      .catch((err) => console.log(err));
  }

  getOrders() {
    return getDB()
      .collection(ORDER_COLLECTION)
      .find({ "user.id": ObjectID(this.id) })
      .toArray();
  }

  createOrder() {
    const dbConnection = getDB();

    return this.getCart()
      .then((products) => {
        const order = {
          user: {
            id: ObjectId(this.id),
            name: this.name,
          },
          items: products,
        };

        return dbConnection.collection(ORDER_COLLECTION).insertOne(order);
      })
      .then((result) => {
        this.cart = { items: [] };
        return dbConnection
          .collection(USER_COLLECTION)
          .updateOne(
            { _id: ObjectID(this.id) },
            { $set: { cart: { items: [] } } }
          );
      })
      .catch((err) => console.log(err));
  }

  deleteProductFromCart(productId) {
    const updatedCartItems = this.cart.items.filter(
      (item) => item.productId.toString() !== productId.toString()
    );

    return getDB()
      .collection(USER_COLLECTION)
      .updateOne(
        { _id: ObjectID(this.id) },
        { $set: { cart: { items: updatedCartItems } } }
      );
  }

  static fetchById(id) {
    return getDB()
      .collection(USER_COLLECTION)
      .findOne({ _id: new ObjectID(id) });
  }
}
module.exports = User;
