const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const sequelize = require("./utils/database");

const adminRoute = require("./routes/admin");
const shopRoute = require("./routes/shop");

const errorController = require("./controllers/error");

const Product = require("./models/product");
const User = require("./models/user");

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

Product.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
User.hasMany(Product);

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
    app.listen(3000);
  })
  .catch((error) => console.log(error));
