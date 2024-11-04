const slugify = require("slugify");
const { check } = require("express-validator");

const User = require("../../models/userModel");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");

exports.createUserValidator = [
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
    .withMessage("Too short User password!"),
  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("Invalid User phone format!"),
  validatorMiddleware,
];

exports.getUserValidator = [
  check("id")
    .notEmpty()
    .withMessage("User id required!")
    .isMongoId()
    .withMessage("Invalid user id format!"),
  validatorMiddleware,
];

exports.updateUserValidator = [
  check("id")
    .notEmpty()
    .withMessage("User id required!")
    .isMongoId()
    .withMessage("Invalid user id format!"),
  check("name")
    .optional()
    .isLength({ min: 3 })
    .withMessage("Too short User name!")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);

      return true;
    }),
  validatorMiddleware,
];

exports.deleteUserValidator = [
  check("id")
    .notEmpty()
    .withMessage("User id required!")
    .isMongoId()
    .withMessage("Invalid user id format!"),
  validatorMiddleware,
];
