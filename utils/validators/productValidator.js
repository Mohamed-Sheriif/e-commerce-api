const slugify = require("slugify");
const { check } = require("express-validator");

const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const Category = require("../../models/categoryModel");
const SubCategory = require("../../models/subCategoryModel");

exports.createProductValidator = [
  check("title")
    .notEmpty()
    .withMessage("Product title is required!")
    .isLength({ min: 10 })
    .withMessage("Too short product title!")
    .isLength({ max: 100 })
    .withMessage("Too long product title!")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);

      return true;
    }),
  check("description")
    .notEmpty()
    .withMessage("Product description required!")
    .isLength({ min: 20 })
    .withMessage("Too short product description!")
    .isLength({ max: 2000 })
    .withMessage("Too long product description!"),
  check("quantity")
    .notEmpty()
    .withMessage("Product quantity required!")
    .isNumeric()
    .withMessage("Product quantity must be a number!"),
  check("sold")
    .optional()
    .isNumeric()
    .withMessage("Product sold must be a number!"),
  check("price")
    .notEmpty()
    .withMessage("Product price required!")
    .isNumeric()
    .withMessage("Product price must me a number!")
    .isLength({ max: 20 })
    .withMessage("Too long product price!"),
  check("priceAfterDiscount")
    .optional()
    .isNumeric()
    .withMessage("Product discount price must me a number!")
    .toFloat()
    .custom((value, { req }) => {
      if (value >= req.body.price) {
        throw new Error(
          "PriceAfterDiscount must be less than the original price!"
        );
      }
      return true;
    }),
  check("colors")
    .optional()
    .isArray()
    .withMessage("Colors must be an array of strings!"),
  check("coverImage").notEmpty().withMessage("Product cover image required!"),
  check("images")
    .optional()
    .isArray()
    .withMessage("Images must be an array of strings!"),
  check("category")
    .notEmpty()
    .withMessage("Product must belong to a category!")
    .isMongoId()
    .withMessage("Invalid category id format!")
    // Validate if the category exists
    .custom(async (categoryId) => {
      const category = await Category.findById(categoryId);
      if (!category) {
        throw new Error(`No category found with the id ${categoryId}`);
      }
    }),
  check("subCategories")
    .optional()
    .isMongoId()
    .withMessage("Invalid sub category id format!")
    // Validate if the sub categories exists
    .custom(async (subCategoriesIds) => {
      const result = await SubCategory.find({
        _id: { $exists: true, $in: subCategoriesIds },
      });

      if (result.length !== subCategoriesIds.length) {
        throw new Error("Invalid subCategories Ids, some ids does not exist!");
      }
    })
    .custom(async (subCategoriesIds, { req }) => {
      const subCategories = await SubCategory.find({
        category: req.body.category,
      }).select("_id");

      const subCategoriesIdsInDb = subCategories.map((subCategory) =>
        subCategory._id.toString()
      );

      // Check if all subCategories belong to the category
      const result = subCategoriesIds.every((id) =>
        subCategoriesIdsInDb.includes(id)
      );

      if (!result) {
        throw new Error("SubCategories not belong to category!");
      }
    }),
  check("brand").optional().isMongoId().withMessage("Invalid brand id format!"),
  check("averageRating")
    .optional()
    .isNumeric()
    .withMessage("Average rating must be a number!")
    .isLength({ min: 1 })
    .withMessage("Rating must be at least 1!")
    .isLength({ max: 5 })
    .withMessage("Rating must can not be more than 5!"),
  check("ratingQuantity")
    .optional()
    .isNumeric()
    .withMessage("Rating quantity must be a number!"),
  validatorMiddleware,
];

exports.getProductValidator = [
  check("id")
    .notEmpty()
    .withMessage("Product id required!")
    .isMongoId()
    .withMessage("Invalid product id format!"),
  validatorMiddleware,
];

exports.updateProductValidator = [
  check("id")
    .notEmpty()
    .withMessage("Product id required!")
    .isMongoId()
    .withMessage("Invalid product id format!"),
  check("title")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);

      return true;
    }),
  validatorMiddleware,
];

exports.deleteProductValidator = [
  check("id")
    .notEmpty()
    .withMessage("Product id required!")
    .isMongoId()
    .withMessage("Invalid product id format!"),
  validatorMiddleware,
];
