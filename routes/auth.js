const express = require("express");
const { check, body } = require("express-validator");

const auth = require("../controllers/auth");
const User = require("../models/user");

const route = express.Router();

route.get("/login", auth.getLogin);
route.post(
  "/login",
  [
    body("email")
      .isEmail()
      .withMessage("Not a valid email!")
      .trim()
      .normalizeEmail(),
    body("password", "Please, enter a valid password")
      .isLength({ min: 5 })
      .isAlphanumeric()
      .trim(),
  ],
  auth.postLogin
);

route.get("/signup", auth.getSignup);
route.post(
  "/signup",
  [
    check("email")
      .isEmail()
      .withMessage("Please, enter a valid email")
      .bail()
      .custom((value, { req }) => {
        console.log("value:", value);
        return User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            console.log("user already has taken");
            return Promise.reject("user already has taken");
          }
        });
      })
      .bail()
      .normalizeEmail()
      .trim(),
    check("password")
      .isLength({ min: 5 })
      .withMessage("Password should have at least 5 chars!")
      .bail()
      .isAlphanumeric()
      .withMessage("Password should be alphanumeric!")
      .bail()
      .trim(),
    check("confirmPassword")
      .trim()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("confirmation password does not match!");
        }
        return true;
      }),
  ],
  auth.postSignup
);

route.get("/reset-password", auth.getResetPassword);
route.get("/reset-password/:resetToken", auth.getNewPassword);
route.post("/reset-password", auth.postResetPassword);
route.post("/new-password", auth.postNewPassword);

route.post("/logout", auth.postLogout);

module.exports = route;
