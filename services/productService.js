const Product = require("../models/productModel");
const factory = require("./handlersFactory");

// @desc    Create New Product
// @Route   POST /api/v1/products
// @access  Private
exports.createProduct = factory.createOne(Product);

// @desc    Get All Products
// @Route   GET /api/v1/products
// @access  Public
exports.getAllProducts = factory.getAll(Product, "product");

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
