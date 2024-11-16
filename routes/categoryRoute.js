const express = require("express");

const {
  createCategory,
  getAllCategories,
  getCategory,
  updateCategory,
  deleteCategory,
  uploadCategoryImage,
  resizeImage,
} = require("../services/categoryService");
const {
  getCategoryValidator,
  createCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
} = require("../utils/validators/categoryValidator");
const SubCategoryRoute = require("./subCategoryRoute");
const AuthService = require("../services/authService");

const router = express.Router();

router.use("/:categoryId/subcategories", SubCategoryRoute);

router
  .route("/")
  .post(
    AuthService.protect,
    AuthService.allowedTo("admin", "manager"),
    uploadCategoryImage,
    resizeImage,
    createCategoryValidator,
    createCategory
  )
  .get(getAllCategories);

router
  .route("/:id")
  .get(getCategoryValidator, getCategory)
  .put(
    AuthService.protect,
    AuthService.allowedTo("admin", "manager"),
    uploadCategoryImage,
    resizeImage,
    updateCategoryValidator,
    updateCategory
  )
  .delete(
    AuthService.protect,
    AuthService.allowedTo("admin"),
    deleteCategoryValidator,
    deleteCategory
  );

module.exports = router;
