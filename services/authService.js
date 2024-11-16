const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const ApiError = require("../utils/apiError");
const User = require("../models/userModel");

const createToken = (payload) =>
  jwt.sign({ userId: payload }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

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
  const token = createToken(user._id);

  res.status(201).json({ data: user, token });
});

// @desc    Login
// @Route   POST /api/v1/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
  // 1) Check if user exists && password is correct
  const user = await User.findOne({ email: req.body.email });
  if (!user || (await bcrypt.compare(req.body.password, user.password))) {
    return next(new ApiError("Incorrect email or password", 401));
  }

  // 2) If everything is ok, send token to client
  const token = createToken(user._id);

  res.status(200).json({ data: user, token });
});

// @desc    Make sure user is logged in
exports.protect = asyncHandler(async (req, res, next) => {
  // 1) Getting token and check if it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
    console.log(token);
  }
  if (!token) {
    return next(
      new ApiError("You are not logged in! Please log in to get access.", 401)
    );
  }
  console.log(token);
  // 2) Verification token
  const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);

  // 3) Check if user still exists
  const user = await User.findById(decode.userId);
  if (!user) {
    return next(
      new ApiError(
        "The user belonging to this token does no longer exist.",
        401
      )
    );
  }

  // 4) Check if user changed password after the token was created
  if (user.passwordChangedAt) {
    const passChangedTimestamp = parseInt(
      user.passwordChangedAt.getTime() / 1000,
      10
    );
    if (decode.iat < passChangedTimestamp) {
      return next(
        new ApiError(
          "User recently changed password! Please log in again.",
          401
        )
      );
    }
  }

  req.user = user;

  next();
});

// @desc    Check user role
exports.allowedTo = (...roles) =>
  asyncHandler((req, res, next) => {
    // 1) access roles
    // 2) access registered user role
    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError("You are not allowed to access this route", 403)
      );
    }
    next();
  });
