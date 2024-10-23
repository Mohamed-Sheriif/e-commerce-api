const Category = require("../models/categoryModel");
const factory = require("./handlersFactory");

// @desc    Create New Category
// @Route   POST /api/v1/categories
// @access  Private
exports.createCategory = factory.createOne(Category);

// @desc    Get All Categories
// @Route   GET /api/v1/categories
// @access  Public
exports.getAllCategories = factory.getAll(Category);

// @desc    Get Specific Category
// @Route   GET /api/v1/categories/:id
// @access  Public
exports.getCategory = factory.getOne(Category);

// @desc    Update Category
// @Route   PUT /api/v1/categories/:id
// @access  Private
exports.updateCategory = factory.updateOne(Category);

// @desc    Delete Category
// @Route   DELETE /api/v1/categories/:id
// @access  Private
exports.deleteCategory = factory.deleteOne(Category);
