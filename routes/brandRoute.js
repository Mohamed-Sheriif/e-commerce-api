const express = require("express");

const {
  createBrand,
  getAllBrands,
  getBrand,
  updateBrand,
  deleteBrand,
} = require("../services/brandService");

const {
  getBrandValidator,
  createBrandValidator,
  updateBrandValidator,
  deleteBrandValidator,
} = require("../utils/validators/brandValidator");

const router = express.Router();

router.route("/").post(createBrandValidator, createBrand).get(getAllBrands);

router
  .route("/:id")
  .get(getBrandValidator, getBrand)
  .put(updateBrandValidator, updateBrand)
  .delete(deleteBrandValidator, deleteBrand);

module.exports = router;
