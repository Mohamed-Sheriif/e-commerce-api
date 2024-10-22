const slugify = require("slugify");
const asyncHandler = require("express-async-handler");

const ApiError = require("../utils/apiError");
const Brand = require("../models/brandModel");
const ApiFeature = require("../utils/apiFeatures");
const factory = require("./handlersFactory");

// @desc    Create New Brand
// @Route   POST /api/v1/brands
// @access  Private
exports.createBrand = factory.createOne(Brand);

// @desc    Get All Brands
// @Route   GET /api/v1/brands
// @access  Public
exports.getAllBrands = asyncHandler(async (req, res) => {
  // Build query
  const documentsCount = await Brand.countDocuments();
  const apiFeature = new ApiFeature(Brand.find(), req.query)
    .paginate(documentsCount)
    .filter()
    .limitFields()
    .search()
    .sort();

  // Execute query
  const { mongooseQuery, paginationResult } = apiFeature;
  const brands = await mongooseQuery;

  res
    .status(200)
    .json({ result: brands.length, paginationResult, data: brands });
});

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
