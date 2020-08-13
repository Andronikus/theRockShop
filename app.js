const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");

const adminRoute = require("./routes/admin");
const shopRoute = require("./routes/shop");

const errorController = require("./controllers/error");
const mongoConnect = require("./utils/database").mongoConnect;

const app = express();

app.set("views", "views");
app.set("view engine", "ejs");

// Temporary (add dummy user to request)
app.use((req, res, next) => {
  next();
});
// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/admin", adminRoute);
app.use(shopRoute);

// 404
app.use(errorController.get404);

mongoConnect()
  .then((client) => {
    console.log("connected to db");
    app.listen(3000);
  })
  .catch((err) => console.log(err));
