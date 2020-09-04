const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const csrf = require("csurf");
const flash = require("connect-flash");
const multer = require("multer");

const adminRoute = require("./routes/admin");
const shopRoute = require("./routes/shop");
const authRoute = require("./routes/auth");

const errorController = require("./controllers/error");

const User = require("./models/user");

const store = new MongoDBStore({
  uri: process.env.MONGO_URI,
  collection: "sessions",
});

const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + "-" + file.originalname);
  },
});

const csrfProtection = csrf();

const app = express();

app.set("views", "views");
app.set("view engine", "ejs");

// Middleware
app.use(multer({ storage: diskStorage }).single("image"));
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
    .then((userDoc) => {
      req.user = userDoc;
      next();
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
});

app.use("/admin", adminRoute);
app.use(shopRoute);
app.use(authRoute);

// 404
app.use(errorController.get404);

// error handling middleware
app.use((error, req, res, next) => {
  res.render("500", {
    docTitle: "Error!",
    path: "/505",
  });
});

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true })
  .then((client) => {
    console.log("connected to db");
    app.listen(3000);
  })
  .catch((err) => console.log(err));
