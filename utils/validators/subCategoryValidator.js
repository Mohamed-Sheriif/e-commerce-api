const { check } = require("express-validator");

const validatorMiddleware = require("../../middlewares/validatorMiddleware");

exports.createSubCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("SubCategory name required!")
    .isLength({ min: 3 })
    .withMessage("Too short subCategory name!")
    .isLength({ max: 32 })
    .withMessage("Too long subCategory name!"),
  check("category")
    .notEmpty()
    .withMessage("SubCategory must belong to a category!")
    .isMongoId()
    .withMessage("Invalid category id format!"),
  validatorMiddleware,
];

exports.getSubCategoryValidator = [
  check("id")
    .notEmpty()
    .withMessage("SubCategory id required!")
    .isMongoId()
    .withMessage("Invalid subCategory id format!"),
  validatorMiddleware,
];

exports.updateSubCategoryValidator = [
  check("id")
    .notEmpty()
    .withMessage("SubCategory id required!")
    .isMongoId()
    .withMessage("Invalid subCategory id format!"),
  check("name")
    .notEmpty()
    .withMessage("SubCategory name required!")
    .isLength({ min: 3 })
    .withMessage("Too short subCategory name!")
    .isLength({ max: 32 })
    .withMessage("Too long subCategory name!"),
  check("category").optional().isMongoId().withMessage("Invalid category"),
  validatorMiddleware,
];

exports.deleteSubCategoryValidator = [
  check("id")
    .notEmpty()
    .withMessage("SubCategory id required!")
    .isMongoId()
    .withMessage("Invalid subCategory id format!"),
  validatorMiddleware,
];
