const express = require("express");

const {
  createCategory,
  getAllCategories,
  getCategory,
  updateCategory,
  deleteCategory,
} = require("../services/categoryService");

const router = express.Router();

router.route("/").post(createCategory).get(getAllCategories);

router
  .route("/:id")
  .get(getCategory)
  .put(updateCategory)
  .delete(deleteCategory);

module.exports = router;
