module.exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    path: "login",
    docTitle: "Login",
  });
};

module.exports.postLogin = (req, res, next) => {
  res.setHeader("Set-Cookie", "isLoggedIn=true");
  res.redirect("/");
};
