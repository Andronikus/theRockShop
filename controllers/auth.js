const crypto = require("crypto");
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
