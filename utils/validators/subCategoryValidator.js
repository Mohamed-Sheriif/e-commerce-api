const slugify = require("slugify");
const { check } = require("express-validator");

const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const Category = require("../../models/categoryModel");

exports.createSubCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("SubCategory name required!")
    .isLength({ min: 3 })
    .withMessage("Too short subCategory name!")
    .isLength({ max: 32 })
    .withMessage("Too long subCategory name!")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);

      return true;
    }),
  check("category")
    .notEmpty()
    .withMessage("SubCategory must belong to a category!")
    .isMongoId()
    .withMessage("Invalid category id format!")
    .custom(async (categoryId) => {
      const category = await Category.findById(categoryId);
      if (!category) {
        throw new Error(`No category found with the id ${categoryId}`);
      }
    }),
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
    .withMessage("Too long subCategory name!")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);

      return true;
    }),
  check("category")
    .optional()
    .isMongoId()
    .withMessage("Invalid category")
    .custom(async (categoryId) => {
      const category = await Category.findById(categoryId);
      if (!category) {
        throw new Error(`No category found with the id ${categoryId}`);
      }
    }),
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
