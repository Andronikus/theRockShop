const express = require("express");

const auth = require("../controllers/auth");

const route = express.Router();

route.get("/login", auth.getLogin);
route.get("/signup", auth.getSignup);
route.get("/reset-password", auth.getResetPassword);

route.post("/login", auth.postLogin);
route.post("/logout", auth.postLogout);
route.post("/signup", auth.postSignup);
route.post("/reset-password", auth.postResetPassword);

module.exports = route;
