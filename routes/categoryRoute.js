const express = require("express");

const {
  createCategory,
  getAllCategories,
  getCategory,
  updateCategory,
  deleteCategory,
} = require("../services/categoryService");
const {
  getCategoryValidator,
  createCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
} = require("../utils/validators/categoryValidator");

const SubCategoryRoute = require("./subCategoryRoute");

const router = express.Router();

router.use("/:categoryId/subcategories", SubCategoryRoute);

router
  .route("/")
  .post(createCategoryValidator, createCategory)
  .get(getAllCategories);

router
  .route("/:id")
  .get(getCategoryValidator, getCategory)
  .put(updateCategoryValidator, updateCategory)
  .delete(deleteCategoryValidator, deleteCategory);

module.exports = router;
