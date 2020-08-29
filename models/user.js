const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    required: true,
  },
  resetPasswordToken: String,
  resetPasswordTokenExpiryTime: Date,
  cart: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          require: true,
        },
        quantity: { type: Number, require: true },
      },
    ],
  },
});

userSchema.methods.addToCart = function (productId) {
  let productInCartIndex = -1;
  let updatedItems = [];

  if (this.cart) {
    updatedItems = [...this.cart.items];
    productInCartIndex = updatedItems.findIndex(
      (item) => item.productId.toString() === product._id.toString()
    );
  }

  if (productInCartIndex >= 0) {
    updatedItems[productInCartIndex].quantity++;
  } else {
    updatedItems.push({ productId: productId, quantity: 1 });
  }

  this.cart.items = updatedItems;

  return this.save();
};

userSchema.methods.deleteProductFromCart = function (productId) {
  const updateCartItems = this.cart.items.filter(
    (item) => item.productId.toString() !== productId.toString()
  );

  this.cart.items = updateCartItems;

  return this.save();
};

userSchema.methods.clearCart = function () {
  this.cart = { items: [] };
  return this.save();
};

module.exports = mongoose.model("User", userSchema);
