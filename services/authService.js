const crypto = require("crypto");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const ApiError = require("../utils/apiError");
const User = require("../models/userModel");
const sendEmail = require("../utils/sendEmail");

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
  }
  if (!token) {
    return next(
      new ApiError("You are not logged in! Please log in to get access.", 401)
    );
  }

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

// @desc    Forgot password
// @Route   POST /api/v1/auth/forgotPassword
// @access  Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  // 1) Get user based on email
  const user = await User.findOne({ email: req.body.email });

  // 2) Check if user exists
  if (!user) {
    return next(new ApiError("There is no user with email address.", 404));
  }

  // 3) Generate the hash random reset token
  const resetCode = Math.floor(100000 + Math.random() * 900000);
  const hashedResetCode = crypto
    .createHash("sha256")
    .update(resetCode.toString())
    .digest("hex");

  // Save hashed reset code to database
  user.passwordResetCode = hashedResetCode;
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  user.passwordResetVerified = false;

  await user.save();

  // 4) Send it to user's email
  const messege = `Hi ${user.name}, \n We received a request to reset your password on E-Shop Account. Your reset code is ${resetCode}. If you didn't request a password reset, you can ignore this email.`;
  try {
    await sendEmail({
      email: user.email,
      subject: "Your password reset token (valid for 10 minutes)",
      messege,
    });
  } catch (error) {
    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;
    user.passwordResetVerified = undefined;

    await user.save();

    return next(
      new ApiError(
        "There was an error sending the email. Try again later!",
        500
      )
    );
  }

  res.status(200).json({
    status: "success",
    messege: "ResetCode sent to email!",
  });
});

// @desc    Verify reset code
// @Route   POST /api/v1/auth/verifyResetCode
// @access  Public
exports.verifyResetCode = asyncHandler(async (req, res, next) => {
  // 1) Get user based on hashed reset code
  const hashedResetCode = crypto
    .createHash("sha256")
    .update(req.body.resetCode)
    .digest("hex");

  const user = await User.findOne({
    passwordResetCode: hashedResetCode,
    passwordResetExpires: { $gt: Date.now() },
  });

  // 2) If reset code has not expired, and there is user, set the new password
  if (!user) {
    return next(new ApiError("Reset code is invalid or has expired", 400));
  }

  user.passwordResetVerified = true;
  await user.save();

  res.status(200).json({
    status: "success",
    messege: "Reset code verified successfully!",
  });
});

// @desc    Reset password
// @Route   PUT /api/v1/auth/resetPassword
// @access  Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
  // 1) Get user based on email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ApiError("User not found", 404));
  }

  // 2) Check if reset code has been verified
  if (!user.passwordResetVerified) {
    return next(new ApiError("Reset code has not been verified", 400));
  }

  // 3) Update changedPasswordAt property for the user
  user.password = await bcrypt.hash(req.body.newPassword, 12);
  user.passwordResetCode = undefined;
  user.passwordResetExpires = undefined;
  user.passwordResetVerified = undefined;
  await user.save();

  // 4) Log the user in, send JWT
  const token = createToken(user._id);

  res.status(200).json({ token });
});
