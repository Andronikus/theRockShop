const User = require("../models/user");

module.exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    path: "login",
    docTitle: "Login",
    isAuthenticated: req.session.isAuthenticated,
  });
};

module.exports.postLogin = (req, res, next) => {
  User.findById("5f3af4e4eb50a26b8c39ff2f")
    .then((user) => {
      req.session.isAuthenticated = true;
      req.session.user = user;

      req.session.save((err) => {
        if (err) {
          console.log("Error saving session");
          return;
        }
        res.redirect("/");
      });
    })
    .then((err) => console.log(err));
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

      const newUser = new User({
        email: email,
        password: password,
        cart: { items: [] },
      });

      return newUser.save();
    })
    .then(() => {
      res.redirect("/login");
    })
    .catch((err) => console.log(err));
};
