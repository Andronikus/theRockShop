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
    cb(null, path.join(__dirname, "images"));
  },
  filename: (req, file, cb) => {
    cb(null, new Date().getUTCMilliseconds() + "-" + file.originalname);
    console.log("filename");
  },
});

const uploadFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const csrfProtection = csrf();

const app = express();

app.set("views", "views");
app.set("view engine", "ejs");

// Middleware
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  multer({ storage: diskStorage, fileFilter: uploadFilter }).single("image")
);
app.use(express.static(path.join(__dirname, "public")));
app.use("/images", express.static(path.join(__dirname, "images")));

app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
  const csrf = req.csrfToken();
  console.log("csrf: ", csrf);

  res.locals.isAuthenticated = req.session.isAuthenticated;
  res.locals.csrfToken = csrf;
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
  console.log(error);
  res.render("500", {
    docTitle: "Error!",
    path: "/505",
    isAuthenticated: req.session.isAuthenticated,
  });
});

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true })
  .then((client) => {
    console.log("connected to db");
    app.listen(3000);
  })
  .catch((err) => console.log(err));
