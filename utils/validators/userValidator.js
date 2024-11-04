const bcrypt = require("bcryptjs");
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
  check("email")
    .optional()
    .isEmail()
    .withMessage("Invalid User email format!")
    .custom(async (val, { req }) => {
      const user = await User.findOne({ email: val });

      if (user) {
        throw new Error("User email already exists!");
      }
    }),
  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("Invalid User phone format!"),
  validatorMiddleware,
];

exports.changeUserPasswordValidator = [
  check("id")
    .notEmpty()
    .withMessage("User id required!")
    .isMongoId()
    .withMessage("Invalid user id format!"),
  check("curruntPassword")
    .notEmpty()
    .withMessage("User current password required!"),
  check("password")
    .notEmpty()
    .withMessage("User new password is required!")
    .isLength({ min: 6 })
    .withMessage("Too short User password!")
    .custom(async (password, { req }) => {
      // 1) Confirm old password
      const user = await User.findById(req.params.id);
      if (!user) {
        throw new Error("User not found!");
      }
      const isCorrectPassword = await bcrypt.compare(
        req.body.curruntPassword,
        user.password
      );
      if (!isCorrectPassword) {
        throw new Error("Current password is incorrect!");
      }

      // 2) Confirm new password
      if (password !== req.body.passwordConfirm) {
        throw new Error("Password confirmation incorrect!");
      }
      return true;
    }),
  check("passwordConfirm")
    .notEmpty()
    .withMessage("User password confirmation required!"),
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
