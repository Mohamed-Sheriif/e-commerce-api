const Brand = require("../models/brandModel");
const factory = require("./handlersFactory");

// @desc    Create New Brand
// @Route   POST /api/v1/brands
// @access  Private
exports.createBrand = factory.createOne(Brand);

// @desc    Get All Brands
// @Route   GET /api/v1/brands
// @access  Public
exports.getAllBrands = factory.getAll(Brand);

// @desc    Get Specific Brand
// @Route   GET /api/v1/brands/:id
// @access  Public
exports.getBrand = factory.getOne(Brand);

// @desc    Update Brand
// @Route   PUT /api/v1/brands/:id
// @access  Private
exports.updateBrand = factory.updateOne(Brand);

// @desc    Delete Brand
// @Route   DELETE /api/v1/brands/:id
// @access  Private
exports.deleteBrand = factory.deleteOne(Brand);
