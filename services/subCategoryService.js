const slugify = require("slugify");
const asyncHandler = require("express-async-handler");

const ApiError = require("../utils/apiError");
const SubCategory = require("../models/subCategoryModel");
const ApiFeature = require("../utils/apiFeatures");
const factory = require("./handlersFactory");

// Nested Route
// @desc    Create New SubCategory For Category
// @Route   POST /api/v1/categories/:categoryId/subcategories
exports.setCategoryIdToBody = (req, res, next) => {
  // if category does not exist in body, set it from params
  if (!req.body.category) req.body.category = req.params.categoryId;
  next();
};

// @desc    Create New SubCategory
// @Route   POST /api/v1/subcategories
// @access  Private
exports.createSubCategory = factory.createOne(SubCategory);

// Nested Route
// @desc    Get All SubCategories For Category
// @Route   GET /api/v1/categories/:categoryId/subcategories
exports.createFilterObj = (req, res, next) => {
  if (req.params.categoryId)
    req.filterObject = { category: req.params.categoryId };

  next();
};
// @desc    Get All SubCategories
// @Route   GET /api/v1/subcategories
// @access  Public
exports.getAllSubCategories = asyncHandler(async (req, res) => {
  // Build query
  const documentsCount = await SubCategory.countDocuments();
  const apiFeature = new ApiFeature(SubCategory.find(), req.query)
    .paginate(documentsCount)
    .filter(req.filterObject)
    .limitFields()
    .search()
    .sort();

  // Execute query
  const { mongooseQuery, paginationResult } = apiFeature;
  const subCategories = await mongooseQuery;

  res.status(200).json({
    result: subCategories.length,
    paginationResult,
    data: subCategories,
  });
});

// @desc    Get Specific SubCategory
// @Route   GET /api/v1/subcategories/:id
// @access  Public
exports.getSubCategory = factory.getOne(SubCategory);

// @desc    Update SubCategory
// @Route   PUT /api/v1/subcategories/:id
// @access  Private
exports.updateSubCategory = factory.updateOne(SubCategory);

// @desc    Delete SubCategory
// @Route   DELETE /api/v1/subcategories/:id
// @access  Private
exports.deleteSubCategory = factory.deleteOne(SubCategory);
