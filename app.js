const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const adminRoute = require("./routes/admin");
const shopRoute = require("./routes/shop");

const errorController = require("./controllers/error");

const app = express();

app.set("views", "views");
app.set("view engine", "ejs");

// Temporary (add dummy user to request)
// app.use((req, res, next) => {
//   User.fetchById("5f369ed4390150724c875833")
//     .then((user) => {
//       req.user = new User(user.name, user.email, user.cart, user._id);
//       next();
//     })
//     .catch((err) => console.log(err));
// });
// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/admin", adminRoute);
app.use(shopRoute);

// 404
app.use(errorController.get404);

mongoose
  .connect(
    "mongodb+srv://shopman:shopman@shop0.qrybc.mongodb.net/shop?retryWrites=true&w=majority",
    { useNewUrlParser: true }
  )
  .then((client) => {
    console.log("connected to db");
    app.listen(3000);
  })
  .catch((err) => console.log(err));
