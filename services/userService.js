const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");

const User = require("../models/userModel");
const factory = require("./handlersFactory");
const ApiError = require("../utils/apiError");
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
// @access  Private/Admin
exports.createUser = factory.createOne(User);

// @desc    Get All Users
// @Route   GET /api/v1/users
// @access  Private/Admin-Manager
exports.getAllUsers = factory.getAll(User);

// @desc    Get Specific User
// @Route   GET /api/v1/users/:id
// @access  Private/Admin-Manager
exports.getUser = factory.getOne(User);

// @desc    Update User
// @Route   PUT /api/v1/users/:id
// @access  Private/Admin
exports.updateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      email: req.body.email,
      role: req.body.role,
      profileImg: req.body.profileImg,
      phone: req.body.phone,
    },
    {
      new: true,
    }
  );

  // Check if user exist
  if (!user) {
    return next(
      new ApiError(`No user found with the id ${req.params.id}`, 404)
    );
  }

  res.status(200).json({ data: user });
});

// @desc    Change User Password
// @Route   PUT /api/v1/users/changePassword/:id
// @access  Private/Admin
exports.changeUserPassword = asyncHandler(async (req, res, next) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 12);

  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      password: hashedPassword,
      passwordChangedAt: Date.now(),
    },
    {
      new: true,
    }
  );

  // Check if user exist
  if (!user) {
    return next(
      new ApiError(`No user found with the id ${req.params.id}`, 404)
    );
  }

  res.status(200).json({ data: user });
});

// @desc    Delete User
// @Route   DELETE /api/v1/users/:id
// @access  Private/Admin
exports.deleteUser = factory.deleteOne(User);

// @desc    Get Me
// @Route   GET /api/v1/users/getMe
// @access  Private/protect
exports.getLogggedInUser = asyncHandler(async (req, res, next) => {
  req.params.id = req.user.id;
  next();
});
