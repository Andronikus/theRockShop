const bcrypt = require("bcryptjs");

const User = require("../models/user");

module.exports.getLogin = (req, res, next) => {
  const flash = req.flash("errorMessage");
  const errorMessage = flash.length > 0 ? flash[0] : null;

  res.render("auth/login", {
    path: "login",
    docTitle: "Login",
    errorMessage: errorMessage,
  });
};

module.exports.postLogin = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email: email })
    .then((userDoc) => {
      if (!userDoc) {
        console.log("invalid email or password");
        req.flash("errorMessage", "invalid user or password");
        return res.redirect("/login");
      }

      bcrypt
        .compare(password, userDoc.password)
        .then((isPasswordMatch) => {
          if (!isPasswordMatch) {
            req.flash("errorMessage", "invalid email or password");
            return res.redirect("/login");
          }

          // create session
          req.session.isAuthenticated = true;
          req.session.user = userDoc;

          return req.session.save((err) => {
            if (err) {
              console.log("Error saving session");
              return;
            }
            res.redirect("/");
          });
        })
        .catch((err) => {
          console.log(err);
          res.redirect("/login");
        });
    })
    .catch((err) => console.log(err));
};

module.exports.postLogout = (req, res, next) => {
  req.session.destroy();
  res.redirect("/");
};

module.exports.getSignup = (req, res, next) => {
  res.render("auth/signup", {
    path: "signup",
    docTitle: "SignUp",
    errorMessage:
      req.flash("errorMessage").length > 0
        ? req.flash("errorMessage")[0]
        : null,
  });
};

module.exports.postSignup = (req, res, next) => {
  const { email, password, confirmpassword } = req.body;

  User.findOne({ email: email })
    .then((userDoc) => {
      if (userDoc) {
        req.flash("errorMessage", "user already has taken");
        return res.redirect("/login");
      }

      return bcrypt.hash(password, 12).then((hashedPassword) => {
        const newUser = new User({
          email: email,
          password: hashedPassword,
          cart: { items: [] },
        });

        return newUser.save().then(() => {
          req.flash("errorMessage", "Something went wrong!");
          res.redirect("/login");
        });
      });
    })

    .catch((err) => console.log(err));
};
