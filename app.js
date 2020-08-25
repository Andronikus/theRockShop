const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const csrf = require("csurf");
const flash = require("connect-flash");

const adminRoute = require("./routes/admin");
const shopRoute = require("./routes/shop");
const authRoute = require("./routes/auth");

const errorController = require("./controllers/error");

const User = require("./models/user");

const store = new MongoDBStore({
  uri: process.env.MONGO_URI,
  collection: "sessions",
});

const csrfProtection = csrf();

const app = express();

app.set("views", "views");
app.set("view engine", "ejs");

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);
app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isAuthenticated;
  res.locals.csrfToken = req.csrfToken();
  next();
});

// Temporary (add dummy user to request)
app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }

  User.findById(req.session.user._id)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

app.use("/admin", adminRoute);
app.use(shopRoute);
app.use(authRoute);

// 404
app.use(errorController.get404);

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true })
  .then((client) => {
    console.log("connected to db");
    app.listen(3000);
  })
  .catch((err) => console.log(err));
