const { ObjectID } = require("mongodb");

const getDB = require("../utils/database").getDB;

const USER_COLLECTION = "users";

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
  //   cart: [items:{productId: hhh, quantity: 5}]
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

  static fetchById(id) {
    return getDB()
      .collection(USER_COLLECTION)
      .findOne({ _id: new ObjectID(id) });
  }
}
module.exports = User;
