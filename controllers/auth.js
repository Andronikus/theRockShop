const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const sendGridTransport = require("nodemailer-sendgrid-transport");
const { validationResult } = require("express-validator");

const { getValidationErrorObj } = require("../utils/validation");

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
    oldInputInfo: {},
    validationErrors: {},
  });
};

module.exports.postLogin = (req, res, next) => {
  const { email, password } = req.body;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const validationErrors = getValidationErrorObj(errors);

    return res.status(422).render("auth/login", {
      path: "login",
      docTitle: "Login",
      errorMessage: errors.array()[0].msg,
      oldInputInfo: {
        email,
      },
      validationErrors,
    });
  }

  User.findOne({ email: email })
    .then((userDoc) => {
      if (!userDoc) {
        return res.status(422).render("auth/login", {
          path: "login",
          docTitle: "Login",
          errorMessage: "invalid email or password",
          oldInputInfo: {
            email,
          },
          validationErrors: {},
        });
      }

      bcrypt
        .compare(password, userDoc.password)
        .then((isPasswordMatch) => {
          if (!isPasswordMatch) {
            return res.status(422).render("auth/login", {
              path: "login",
              docTitle: "Login",
              errorMessage: "invalid email or password",
              oldInputInfo: {
                email,
              },
              validationErrors: {},
            });
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
          return res.status(500).render("auth/login", {
            path: "login",
            docTitle: "Login",
            errorMessage: "Something went wrong!",
            oldInputInfo: {
              email,
            },
            validationErrors: {},
          });
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
    oldInputInfo: {
      email: "",
      password: "",
    },
    validationErrors: {},
  });
};

module.exports.postSignup = (req, res, next) => {
  const { email, password } = req.body;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const validationErrors = getValidationErrorObj(errors);

    return res.status(422).render("auth/signup", {
      path: "signup",
      docTitle: "SignUp",
      errorMessage: errors.array()[0].msg,
      oldInputInfo: {
        email,
        password,
      },
      validationErrors,
    });
  }

  bcrypt
    .hash(password, 12)
    .then((hashedPassword) => {
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

module.exports.postResetPassword = (req, res, next) => {
  const { email } = req.body;

  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log("randomBytes error", err);
      res.redirect("/");
    }

    const token = buffer.toString("hex");

    User.findOne({ email })
      .then((user) => {
        if (!user) {
          req.flash("errorMessage", "Email not found");
          req.redirect("/reset-password");
        }

        user.resetPasswordToken = token;
        user.resetPasswordTokenExpiryTime = Date.now() + 3600000;

        return user.save();
      })
      .then(() => {
        res.redirect("/reset-password");
        return transporter.sendMail({
          to: req.body.email,
          from: process.env.MAIL_SENDER,
          subject: "The Rock Shop: time to change your pw",
          html: `
                <p>Hello! http://localhost:3000/reset-password/${token} </p>
            `,
        });
      })
      .catch((err) => console.log(err));
  });
};

module.exports.getNewPassword = (req, res, next) => {
  const { resetToken } = req.params;

  User.findOne({
    resetPasswordToken: resetToken,
    resetPasswordTokenExpiryTime: { $gt: Date.now() },
  })
    .then((user) => {
      if (!user) {
        req.flash(
          "errorMessage",
          "ouch! something went wrong! took too much time reset password?"
        );
        return res.redirect("/reset-password");
      }

      const flash = req.flash("errorMessage");
      const errorMessage = flash.length > 0 ? flash[0] : null;

      res.render("auth/new-password", {
        path: "new-password",
        docTitle: "New password",
        userId: user._id.toString(),
        resetToken: resetToken,
        errorMessage: errorMessage,
      });
    })
    .catch((err) => console.log(err));
};

module.exports.postNewPassword = (req, res, next) => {
  const { newPassword, userId, resetToken } = req.body;

  let user;

  User.findOne({
    _id: userId,
    resetPasswordToken: resetToken,
    resetPasswordTokenExpiryTime: { $gt: Date.now() },
  })
    .then((result) => {
      if (!result) {
        req.flash("errorMessage", "Ops! Something went wrong!");
        return res.redirect("/reset-password");
      }

      user = result;
      return bcrypt.hash(newPassword, 12);
    })
    .then((hashedPassword) => {
      user.password = hashedPassword;
      user.resetPasswordToken = undefined;
      user.resetPasswordTokenExpiryTime = undefined;

      return user.save();
    })
    .then((result) => {
      res.redirect("/login");
    })
    .catch((err) => console.log(err));
};
