const slugify = require("slugify");
const asyncHandler = require("express-async-handler");

const ApiError = require("../utils/apiError");
const Product = require("../models/productModel");

// @desc    Create New Product
// @Route   POST /api/v1/products
// @access  Private
exports.createProduct = asyncHandler(async (req, res) => {
  req.body.slug = slugify(req.body.title);

  const product = await Product.create(req.body);

  res.status(201).json({ data: product });
});

// @desc    Get All Products
// @Route   GET /api/v1/products
// @access  Public
exports.getAllProducts = asyncHandler(async (req, res) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 5;
  const skip = (page - 1) * limit;

  const products = await Product.find({}).skip(skip).limit(limit).populate({
    path: "category",
    select: "name -_id",
  });

  res.status(200).json({ result: products.length, page, data: products });
});

// @desc    Get Specific Product
// @Route   GET /api/v1/products/:id
// @access  Public
exports.getProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const product = await Product.findById(id).populate({
    path: "category",
    select: "name -_id",
  });

  // Check if product exist
  if (!product) {
    return next(new ApiError(`No product found with the id ${id}`, 404));
  }

  res.status(200).json({ data: product });
});

// @desc    Update Product
// @Route   PUT /api/v1/products/:id
// @access  Private
exports.updateProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  if (req.body.title) req.body.slug = slugify(req.body.title);

  const product = await Product.findByIdAndUpdate({ _id: id }, req.body, {
    new: true,
  });

  // Check if product exist
  if (!product) {
    return next(new ApiError(`No product found with the id ${id}`, 404));
  }

  res.status(200).json({ data: product });
});

// @desc    Delete Product
// @Route   DELETE /api/v1/product/:id
// @access  Private
exports.deleteProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const product = await Product.findByIdAndDelete({ _id: id });

  // Check if product exist
  if (!product) {
    return next(new ApiError(`No product found with the id ${id}`, 404));
  }

  res.status(204).send();
});
