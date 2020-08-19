const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const adminRoute = require("./routes/admin");
const shopRoute = require("./routes/shop");
const authRoute = require("./routes/auth");

const errorController = require("./controllers/error");

const User = require("./models/user");

const app = express();

app.set("views", "views");
app.set("view engine", "ejs");

// Temporary (add dummy user to request)
app.use((req, res, next) => {
  User.findById("5f3af4e4eb50a26b8c39ff2f")
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});
// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/admin", adminRoute);
app.use(shopRoute);
app.use(authRoute);

// 404
app.use(errorController.get404);

mongoose
  .connect(
    "mongodb+srv://shopman:shopman@shop0.qrybc.mongodb.net/shop?retryWrites=true&w=majority",
    { useNewUrlParser: true }
  )
  .then((client) => {
    User.findOne().then((user) => {
      if (!user) {
        const newUser = new User({
          name: "Andronikus",
          email: "andronikus@gmail.com",
          cart: {
            items: [],
          },
        });
        newUser.save();
      }
    });

    console.log("connected to db");
    app.listen(3000);
  })
  .catch((err) => console.log(err));
