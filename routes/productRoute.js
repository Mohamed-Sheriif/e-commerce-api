const express = require("express");

const {
  createProduct,
  getAllProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  uploadProductImages,
  reziseProductImages,
} = require("../services/productService");

const {
  createProductValidator,
  getProductValidator,
  updateProductValidator,
  deleteProductValidator,
} = require("../utils/validators/productValidator");
const AuthService = require("../services/authService");

const router = express.Router();

router
  .route("/")
  .post(
    AuthService.protect,
    AuthService.allowedTo("admin", "manager"),
    uploadProductImages,
    reziseProductImages,
    createProductValidator,
    createProduct
  )
  .get(getAllProducts);

router
  .route("/:id")
  .get(getProductValidator, getProduct)
  .put(
    AuthService.protect,
    AuthService.allowedTo("admin", "manager"),
    uploadProductImages,
    reziseProductImages,
    updateProductValidator,
    updateProduct
  )
  .delete(
    AuthService.protect,
    AuthService.allowedTo("admin"),
    deleteProductValidator,
    deleteProduct
  );

module.exports = router;
