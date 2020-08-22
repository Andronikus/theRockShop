const bcrypt = require("bcryptjs");

const User = require("../models/user");

module.exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    path: "login",
    docTitle: "Login",
    isAuthenticated: req.session.isAuthenticated,
  });
};

module.exports.postLogin = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email: email })
    .then((userDoc) => {
      if (!userDoc) {
        console.log(" email/pw not valid!");
        return res.redirect("/login");
      }

      bcrypt
        .compare(password, userDoc.password)
        .then((isPasswordMatch) => {
          if (!isPasswordMatch) {
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
    isAuthenticated: req.session.isAuthenticated,
  });
};

module.exports.postSignup = (req, res, next) => {
  const { email, password, confirmpassword } = req.body;

  User.findOne({ email: email })
    .then((userDoc) => {
      if (userDoc) {
        return res.redirect("/login");
      }

      return bcrypt.hash(password, 12).then((hashedPassword) => {
        const newUser = new User({
          email: email,
          password: hashedPassword,
          cart: { items: [] },
        });

        return newUser.save();
      });
    })
    .then(() => {
      res.redirect("/login");
    })
    .catch((err) => console.log(err));
};
