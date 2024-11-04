const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const ApiError = require("../utils/apiError");
const User = require("../models/userModel");

// @desc    Sign Up
// @Route   POST /api/v1/auth/signup
// @access  Public
exports.signup = asyncHandler(async (req, res, next) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 12);

  // 1) Create user
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
  });

  // 2) Create token
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  res.status(201).json({ data: user, token });
});
