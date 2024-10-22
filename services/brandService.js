const slugify = require("slugify");
const asyncHandler = require("express-async-handler");

const ApiError = require("../utils/apiError");
const Brand = require("../models/brandModel");
const ApiFeature = require("../utils/apiFeatures");
const factory = require("./handlersFactory");

// @desc    Create New Brand
// @Route   POST /api/v1/brands
// @access  Private
exports.createBrand = asyncHandler(async (req, res) => {
  const { name } = req.body;

  const brand = await Brand.create({ name, slug: slugify(name) });

  res.status(201).json({ data: brand });
});

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
exports.getBrand = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const brand = await Brand.findById(id);

  // Check if brands exist
  if (!brand) {
    return next(new ApiError(`No brand found with the id ${id}`, 404));
  }

  res.status(200).json({ data: brand });
});

// @desc    Update Brand
// @Route   PUT /api/v1/brands/:id
// @access  Private
exports.updateBrand = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;

  const brand = await Brand.findByIdAndUpdate(
    { _id: id },
    { name, slug: slugify(name) },
    { new: true }
  );

  // Check if brand exist
  if (!brand) {
    return next(new ApiError(`No brand found with the id ${id}`, 404));
  }

  res.status(200).json({ data: brand });
});

// @desc    Delete Brand
// @Route   DELETE /api/v1/brands/:id
// @access  Private
exports.deleteBrand = factory.deleteOne(Brand);
