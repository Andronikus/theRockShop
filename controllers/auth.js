module.exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    path: "login",
    docTitle: "Login",
  });
};

module.exports.postLogin = (req, res, next) => {
  req.session.isLoggedIn = true;
  res.redirect("/");
};
