const express = require("express");

const {
  createSubCategory,
  getAllSubCategories,
  getSubCategory,
  updateSubCategory,
  deleteSubCategory,
  setCategoryIdToBody,
  createFilterObj,
} = require("../services/subCategoryService");
const {
  createSubCategoryValidator,
  getSubCategoryValidator,
  updateSubCategoryValidator,
  deleteSubCategoryValidator,
} = require("../utils/validators/subCategoryValidator");
const AuthService = require("../services/authService");

// mergeParams: Allow us to access params on other routers
// ex: we need to access categoryId from category route
const router = express.Router({ mergeParams: true });

router
  .route("/")
  .post(
    AuthService.protect,
    AuthService.allowedTo("admin", "manager"),
    setCategoryIdToBody,
    createSubCategoryValidator,
    createSubCategory
  )
  .get(createFilterObj, getAllSubCategories);
router
  .route("/:id")
  .get(getSubCategoryValidator, getSubCategory)
  .put(
    AuthService.protect,
    AuthService.allowedTo("admin", "manager"),
    updateSubCategoryValidator,
    updateSubCategory
  )
  .delete(
    AuthService.protect,
    AuthService.allowedTo("admin"),
    deleteSubCategoryValidator,
    deleteSubCategory
  );

module.exports = router;
