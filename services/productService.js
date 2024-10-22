const slugify = require("slugify");
const asyncHandler = require("express-async-handler");

const ApiError = require("../utils/apiError");
const Product = require("../models/productModel");
const ApiFeature = require("../utils/apiFeatures");
const factory = require("./handlersFactory");

// @desc    Create New Product
// @Route   POST /api/v1/products
// @access  Private
exports.createProduct = factory.createOne(Product);

// @desc    Get All Products
// @Route   GET /api/v1/products
// @access  Public
exports.getAllProducts = asyncHandler(async (req, res) => {
  // Build query
  const documentsCount = await Product.countDocuments();
  const apiFeature = new ApiFeature(Product.find(), req.query)
    .paginate(documentsCount)
    .filter()
    .limitFields()
    .search("Product")
    .sort();

  // Execute query
  const { mongooseQuery, paginationResult } = apiFeature;
  const products = await mongooseQuery;

  res
    .status(200)
    .json({ result: products.length, paginationResult, data: products });
});

// @desc    Get Specific Product
// @Route   GET /api/v1/products/:id
// @access  Public
exports.getProduct = factory.getOne(Product);

// @desc    Update Product
// @Route   PUT /api/v1/products/:id
// @access  Private
exports.updateProduct = factory.updateOne(Product);

// @desc    Delete Product
// @Route   DELETE /api/v1/product/:id
// @access  Private
exports.deleteProduct = factory.deleteOne(Product);
