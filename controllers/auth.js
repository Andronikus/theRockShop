const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const sendGridTransport = require("nodemailer-sendgrid-transport");

const transporter = nodemailer.createTransport(
  sendGridTransport({
    auth: {
      api_key: process.env.SENDGRID_API_KEY,
    },
  })
);

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
          res.redirect("/login");
          return transporter.sendMail({
            to: email,
            from: process.env.MAIL_SENDER,
            subject: "Please confirm your account",
            html:
              '<div><h1>Please confirm your account <a href="http://localhost:3000/login">here</a></h1></div>',
          });
        });
      });
    })
    .catch((err) => console.log(err));
};

module.exports.getResetPassword = (req, res, next) => {
  const flash = req.flash("errorMessage");
  const errorMessage = flash.length > 0 ? flash[0] : null;

  res.render("auth/reset-password", {
    path: "reset-password",
    docTitle: "Reset Password",
    errorMessage: errorMessage,
  });
};
