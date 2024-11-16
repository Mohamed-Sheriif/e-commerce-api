const asyncHandler = require("express-async-handler");
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");

const Product = require("../models/productModel");
const factory = require("./handlersFactory");
const {
  uploadMultibleImages,
} = require("../middlewares/uploadImageMiddleware");

// @desc    Upload Product Images
exports.uploadProductImages = uploadMultibleImages([
  { name: "coverImage", maxCount: 1 },
  { name: "images", maxCount: 3 },
]);

// @desc    Resize Product Images
exports.reziseProductImages = asyncHandler(async (req, res, next) => {
  // 1) Image processing for coverImage
  if (req.files.imageCover) {
    const imageCoverFileName = `product-${uuidv4()}-${Date.now()}-cover.jpeg`;

    await sharp(req.files.imageCover[0].buffer)
      .resize(2000, 1333)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`uploads/products/${imageCoverFileName}`);

    // Save Image Name to req.body for Create Product
    req.body.coverImage = imageCoverFileName;
  }

  // 2) Images processing for images
  if (req.files.images) {
    req.body.images = [];

    await Promise.all(
      req.files.images.map(async (img, i) => {
        const imageName = `product-${uuidv4()}-${Date.now()}-${i + 1}.jpeg`;

        await sharp(img.buffer)
          .resize(2000, 1333)
          .toFormat("jpeg")
          .jpeg({ quality: 90 })
          .toFile(`uploads/products/${imageName}`);

        req.body.images.push(imageName);
      })
    );
  }

  next();
});

// @desc    Create New Product
// @Route   POST /api/v1/products
// @access  Private/Admin-Manager
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
// @access  Private/Admin-Manager
exports.updateProduct = factory.updateOne(Product);

// @desc    Delete Product
// @Route   DELETE /api/v1/product/:id
// @access  Private/Admin
exports.deleteProduct = factory.deleteOne(Product);
