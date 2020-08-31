const express = require("express");
const { check } = require("express-validator/check");

const auth = require("../controllers/auth");

const route = express.Router();

route.get("/login", auth.getLogin);
route.post("/login", auth.postLogin);

route.get("/signup", auth.getSignup);
route.post(
  "/signup",
  check("email").isEmail().withMessage("Please, enter a valid email"),
  check("password")
    .isLength({ min: 5 })
    .isAlphanumeric()
    .withMessage(
      "Password should be alphanumeric and with at least 5 characteres!"
    ),
  check("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("confirmation password does not match!");
    }
    return true;
  }),
  auth.postSignup
);

route.get("/reset-password", auth.getResetPassword);
route.get("/reset-password/:resetToken", auth.getNewPassword);
route.post("/reset-password", auth.postResetPassword);
route.post("/new-password", auth.postNewPassword);

route.post("/logout", auth.postLogout);

module.exports = route;
