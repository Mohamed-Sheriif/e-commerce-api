const slugify = require("slugify");
const { check } = require("express-validator");

const validatorMiddleware = require("../../middlewares/validatorMiddleware");

exports.createCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("Category name required!")
    .isLength({ min: 3 })
    .withMessage("Too short category name!")
    .isLength({ max: 32 })
    .withMessage("Too long category name!"),
  validatorMiddleware,
];

exports.getCategoryValidator = [
  check("id")
    .notEmpty()
    .withMessage("Category id required!")
    .isMongoId()
    .withMessage("Invalid category id format!"),
  validatorMiddleware,
];

exports.updateCategoryValidator = [
  check("id")
    .notEmpty()
    .withMessage("Category id required!")
    .isMongoId()
    .withMessage("Invalid category id format!"),
  check("name")
    .notEmpty()
    .withMessage("Category name required!")
    .isLength({ min: 3 })
    .withMessage("Too short category name!")
    .isLength({ max: 32 })
    .withMessage("Too long category name!")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);

      return true;
    }),
  validatorMiddleware,
];

exports.deleteCategoryValidator = [
  check("id")
    .notEmpty()
    .withMessage("Category id required!")
    .isMongoId()
    .withMessage("Invalid category id format!"),
  validatorMiddleware,
];
