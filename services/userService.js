const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const asyncHandler = require("express-async-handler");

const User = require("../models/userModel");
const factory = require("./handlersFactory");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");

// Upload Single Image
exports.uploadUserImage = uploadSingleImage("profileImg");

// Image Processing
exports.resizeImage = asyncHandler(async (req, res, next) => {
  const fileName = `user-${uuidv4()}-${Date.now()}.jpeg`;

  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`uploads/users/${fileName}`);

    // Save Image Name to req.body for Create user
    req.body.profileImg = fileName;
  }
  next();
});

// @desc    Create New User
// @Route   POST /api/v1/users
// @access  Private
exports.createUser = factory.createOne(User);

// @desc    Get All Users
// @Route   GET /api/v1/users
// @access  Private
exports.getAllUsers = factory.getAll(User);

// @desc    Get Specific User
// @Route   GET /api/v1/ssers/:id
// @access  Private
exports.getUser = factory.getOne(User);

// @desc    Update User
// @Route   PUT /api/v1/users/:id
// @access  Private
exports.updateUser = factory.updateOne(User);

// @desc    Delete User
// @Route   DELETE /api/v1/users/:id
// @access  Private
exports.deleteUser = factory.deleteOne(User);
