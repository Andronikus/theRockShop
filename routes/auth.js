const express = require("express");

const auth = require("../controllers/auth");

const route = express.Router();

route.get("/login", auth.getLogin);
route.post("/login", auth.postLogin);

route.get("/signup", auth.getSignup);
route.post("/signup", auth.postSignup);

route.get("/reset-password", auth.getResetPassword);
route.get("/reset-password/:resetToken", auth.getNewPassword);
route.post("/reset-password", auth.postResetPassword);
route.post("/new-password", auth.postNewPassword);

route.post("/logout", auth.postLogout);

module.exports = route;
