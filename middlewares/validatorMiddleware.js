const { validationResult } = require("express-validator");

// @desc  finds the validation errors in the request and wraps them in an object with andy function
const validatorMiddleware = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  next();
};

module.exports = validatorMiddleware;
