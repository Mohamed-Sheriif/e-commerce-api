const slugify = require("slugify");
const asyncHandler = require("express-async-handler");

const ApiError = require("../utils/apiError");
const Category = require("../models/categoryModel");

// @desc    Create New Category
// @Route   POST /api/v1/categories
// @access  Private
exports.createCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;

  const category = await Category.create({ name, slug: slugify(name) });

  res.status(201).json({ data: category });
});

// @desc    Get All Categories
// @Route   GET /api/v1/categories
// @access  Public
exports.getAllCategories = asyncHandler(async (req, res) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 5;
  const skip = (page - 1) * limit;

  const categories = await Category.find({}).skip(skip).limit(limit);

  res.status(200).json({ result: categories.length, page, data: categories });
});

// @desc    Get Specific Category
// @Route   GET /api/v1/categories/:id
// @access  Public
exports.getCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const category = await Category.findById(id);

  // Check if category exist
  if (!category) {
    return next(new ApiError(`No category found with the id ${id}`, 404));
  }

  res.status(200).json({ data: category });
});

// @desc    Update Category
// @Route   PUT /api/v1/categories/:id
// @access  Private
exports.updateCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;

  const category = await Category.findByIdAndUpdate(
    { _id: id },
    { name, slug: slugify(name) },
    { new: true }
  );

  // Check if category exist
  if (!category) {
    return next(new ApiError(`No category found with the id ${id}`, 404));
  }

  res.status(200).json({ data: category });
});

// @desc    Delete Category
// @Route   DELETE /api/v1/categories/:id
// @access  Private
exports.deleteCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const category = await Category.findByIdAndDelete({ _id: id });

  // Check if category exist
  if (!category) {
    return next(new ApiError(`No category found with the id ${id}`, 404));
  }

  res.status(204).send();
});
