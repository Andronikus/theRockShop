module.exports.getValidationErrorObj = (errors) => {
  if (!errors) return {};

  return errors.array().reduce((errObj, e) => {
    const newError = { ...errObj };
    newError[e.param] = e.param;
    return newError;
  }, {});
};
