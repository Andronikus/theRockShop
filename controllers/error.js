const get404 = (req, res, next) => {
  res
    .status(404)
    .render("404", {
      docTitle: "Not found",
      path: "",
      isAuthenticated: req.session.isAuthenticated,
    });
};

module.exports = {
  get404,
};
