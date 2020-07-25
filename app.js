const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");

const adminRoute = require("./routes/admin");
const shopRoute = require("./routes/shop");

const errorController = require("./controllers/error");

const app = express();
/*
app.engine(
  "handlebars",
  handlebars({ layoutsDir: "views/layouts", defaultLayout: "main-layout" })
);
*/
app.set("views", "views");
app.set("view engine", "ejs");

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/admin", adminRoute);
app.use(shopRoute);

// 404
app.use(errorController.get404);

app.listen(3000);
