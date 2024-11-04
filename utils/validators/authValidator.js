const bcrypt = require("bcryptjs");
const slugify = require("slugify");
const { check } = require("express-validator");

const User = require("../../models/userModel");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");

exports.signupValidator = [
  check("name")
    .notEmpty()
    .withMessage("User name required!")
    .isLength({ min: 3 })
    .withMessage("Too short User name!")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);

      return true;
    }),
  check("email")
    .notEmpty()
    .withMessage("User email required!")
    .isEmail()
    .withMessage("Invalid User email format!")
    .custom(async (val, { req }) => {
      const user = await User.findOne({ email: val });

      if (user) {
        throw new Error("User email already exists!");
      }
    }),
  check("password")
    .notEmpty()
    .withMessage("User password required!")
    .isLength({ min: 6 })
    .withMessage("Too short User password!")
    .custom((password, { req }) => {
      if (password !== req.body.passwordConfirmation) {
        throw new Error("Password confirmation incorrect!");
      }
      return true;
    }),
  check("passwordConfirmation")
    .notEmpty()
    .withMessage("User password confirmation required!"),
  validatorMiddleware,
];
