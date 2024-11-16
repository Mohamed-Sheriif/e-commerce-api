const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const asyncHandler = require("express-async-handler");

const Category = require("../models/categoryModel");
const factory = require("./handlersFactory");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");

// Upload Single Image
exports.uploadCategoryImage = uploadSingleImage("image");

// Image Processing
exports.resizeImage = asyncHandler(async (req, res, next) => {
  const fileName = `category-${uuidv4()}-${Date.now()}.jpeg`;

  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`uploads/categories/${fileName}`);

    // Save Image Name to req.body for Create Category
    req.body.image = fileName;
  }

  next();
});

// @desc    Create New Category
// @Route   POST /api/v1/categories
// @access  Private/Admin-Manager
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
// @access  Private/Admin-Manager
exports.updateCategory = factory.updateOne(Category);

// @desc    Delete Category
// @Route   DELETE /api/v1/categories/:id
// @access  Private/Admin
exports.deleteCategory = factory.deleteOne(Category);
