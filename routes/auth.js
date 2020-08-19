const express = require("express");

const auth = require("../controllers/auth");

const route = express.Router();

route.get("/login", auth.getLogin);

module.exports = route;
