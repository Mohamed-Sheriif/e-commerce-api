const ApiError = require("../utils/apiError");

const sendErrForDev = (err, res) =>
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });

const sendErrForProd = (err, res) =>
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });

const handleJwtInvalidError = (err, res) =>
  new ApiError("Invalid token, please login again", 401);

const TokenExpiredError = (err, res) =>
  new ApiError("Expired token, please login again", 401);

const globalError = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrForDev(err, res);
  } else {
    if (err.name === "JsonWebTokenError") err = handleJwtInvalidError(err, res);
    if (err.name === "TokenExpiredError") err = TokenExpiredError(err, res);
    sendErrForProd(err, res);
  }
};

module.exports = globalError;
