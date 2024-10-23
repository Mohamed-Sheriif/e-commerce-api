const slugify = require("slugify");
const { check } = require("express-validator");

const validatorMiddleware = require("../../middlewares/validatorMiddleware");

exports.createBrandValidator = [
  check("name")
    .notEmpty()
    .withMessage("Brand name required!")
    .isLength({ min: 3 })
    .withMessage("Too short brand name!")
    .isLength({ max: 32 })
    .withMessage("Too long brand name!")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);

      return true;
    }),
  validatorMiddleware,
];

exports.getBrandValidator = [
  check("id")
    .notEmpty()
    .withMessage("Brand id required!")
    .isMongoId()
    .withMessage("Invalid brand id format!"),
  validatorMiddleware,
];

exports.updateBrandValidator = [
  check("id")
    .notEmpty()
    .withMessage("Brand id required!")
    .isMongoId()
    .withMessage("Invalid brand id format!"),
  check("name")
    .notEmpty()
    .withMessage("Brand name required!")
    .isLength({ min: 3 })
    .withMessage("Too short brand name!")
    .isLength({ max: 32 })
    .withMessage("Too long brand name!")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);

      return true;
    }),
  validatorMiddleware,
];

exports.deleteBrandValidator = [
  check("id")
    .notEmpty()
    .withMessage("Brand id required!")
    .isMongoId()
    .withMessage("Invalid brand id format!"),
  validatorMiddleware,
];
