const mongodb = require("mongodb");

const getBD = require("../utils/database").getDB;

const ObjectID = mongodb.ObjectID;

class Product {
  constructor(title, price, imageUrl, description, id, userId) {
    this.title = title;
    this.price = price;
    this.imageUrl = imageUrl;
    this.description = description;
    this.id = id ? new ObjectID(id) : null;
    this.userId = userId;
  }

  save() {
    if (!this.id) {
      return getBD().collection("products").insertOne({
        title: this.title,
        price: this.price,
        imageUrl: this.imageUrl,
        description: this.description,
        userId: this.userId,
      });
    } else {
      return getBD()
        .collection("products")
        .updateOne(
          { _id: this.id },
          {
            $set: {
              title: this.title,
              price: this.price,
              imageUrl: this.imageUrl,
              description: this.description,
            },
          }
        );
    }
  }

  static fetchAll() {
    return getBD()
      .collection("products")
      .find({})
      .toArray()
      .then((results) => results)
      .catch((err) => console.log(err));
  }

  static fetchById(id) {
    return getBD()
      .collection("products")
      .find({ _id: new ObjectID(id) })
      .next()
      .then((product) => product)
      .catch((err) => console.log(err));
  }

  static deleteById(id) {
    return getBD()
      .collection("products")
      .deleteOne({ _id: new ObjectID(id) });
  }
}

module.exports = Product;
