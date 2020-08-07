const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const sequelize = require("./utils/database");

const adminRoute = require("./routes/admin");
const shopRoute = require("./routes/shop");

const errorController = require("./controllers/error");

const Product = require("./models/product");
const User = require("./models/user");
const Cart = require("./models/cart");
const CartItem = require("./models/cartItem");
const Order = require("./models/order");
const OrderItem = require("./models/orderItem");

const app = express();
/*
app.engine(
  "handlebars",
  handlebars({ layoutsDir: "views/layouts", defaultLayout: "main-layout" })
);
*/
app.set("views", "views");
app.set("view engine", "ejs");

// Temporary (add dummy user to request)
app.use((req, res, next) => {
  User.findByPk(1)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((error) => console.log(error));
});
// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/admin", adminRoute);
app.use(shopRoute);

// 404
app.use(errorController.get404);

User.hasMany(Product);
Product.belongsTo(User, { constraints: true, onDelete: "CASCADE" });

User.hasOne(Cart);
Cart.belongsTo(User);

Product.belongsToMany(Cart, { through: CartItem });
Cart.belongsToMany(Product, { through: CartItem });

Order.belongsTo(User);
User.hasMany(Order);

Product.belongsToMany(Order, { through: OrderItem });
Order.belongsToMany(Product, { through: OrderItem });

sequelize
  // .sync({ force: true })
  .sync()
  .then((results) => User.findByPk(1))
  .then((user) => {
    if (!user) {
      return User.create({ name: "Andronikus", email: "qwerty@gmail.com" });
    }

    return user;
  })
  .then((user) => {
    user.getCart().then((cart) => {
      if (!cart) {
        return user.createCart();
      }
      return cart;
    });
  })
  .then(() => {
    app.listen(3000);
  })
  .catch((error) => console.log(error));
