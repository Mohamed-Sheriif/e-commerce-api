const express = require("express");

const {
  createBrand,
  getAllBrands,
  getBrand,
  updateBrand,
  deleteBrand,
  uploadBrandImage,
  resizeImage,
} = require("../services/brandService");

const {
  getBrandValidator,
  createBrandValidator,
  updateBrandValidator,
  deleteBrandValidator,
} = require("../utils/validators/brandValidator");
const AuthService = require("../services/authService");

const router = express.Router();

router
  .route("/")
  .post(
    AuthService.protect,
    AuthService.allowedTo("admin", "manager"),
    uploadBrandImage,
    resizeImage,
    createBrandValidator,
    createBrand
  )
  .get(getAllBrands);

router
  .route("/:id")
  .get(getBrandValidator, getBrand)
  .put(
    AuthService.protect,
    AuthService.allowedTo("admin", "manager"),
    uploadBrandImage,
    resizeImage,
    updateBrandValidator,
    updateBrand
  )
  .delete(
    AuthService.protect,
    AuthService.allowedTo("admin"),
    deleteBrandValidator,
    deleteBrand
  );

module.exports = router;
