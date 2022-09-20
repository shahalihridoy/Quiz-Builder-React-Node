const httpStatus = require("http-status");
const AppError = require("../utils/appError");

const handleMongoCastError = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, httpStatus.BAD_REQUEST);
};

const handleMongoDuplicateError = (err) => {
  const value = err.errmsg.match(/(["'])(?:(?=(\\?))\2.)*?\1/);
  const message = `Duplicate field value: ${value}`;
  return new AppError(message, httpStatus.BAD_REQUEST);
};

const handleMongoValidationError = (err) => {
  const errors = Object.values(err.errors).map((e) => e.message);
  const message = `Invalid input data ${errors.join(", ")}`;

  return new AppError(message, httpStatus.BAD_REQUEST);
};

const handleJwtError = () =>
  new AppError("Invalid token. Please login again!", httpStatus.UNAUTHORIZED);

const handleTokenError = () =>
  new AppError(
    "Your token has expired. Please login again!",
    httpStatus.UNAUTHORIZED
  );

const handleJSONParseError = (err) =>
  new AppError(err.message, httpStatus.BAD_REQUEST);

const sendDevError = (err, res) => {
  console.log(err);
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
    err,
  });
};

const sendProdError = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.log(err);
    res.status(500).json({
      status: "error",
      message: "Unknown error",
    });
  }
};

const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendDevError(err, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err, message: err.message };
    if (err.name === "CastError") error = handleMongoCastError(err);
    else if (err.code === 11000) error = handleMongoDuplicateError(err);
    else if (err.name === "JsonWebTokenError") error = handleJwtError(err);
    else if (err.name === "TokenExpiredError") error = handleTokenError(err);
    else if (err.name === "ValidationError")
      error = handleMongoValidationError(err);
    else if (err.type === "entity.parse.failed")
      error = handleJSONParseError(err);

    sendProdError(error, res);
  }
};

module.exports = errorHandler;
