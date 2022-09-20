const rateLimit = require("express-rate-limit");
const httpStatus = require("http-status");
const AppError = require("../utils/appError");

const rateLimiter = rateLimit({
  windowMs: 15 * 1000,
  max: 3,
  skipSuccessfulRequests: false,
  handler: (req, res, next) => {
    next(
      new AppError(
        "Too many requests, Please try again later",
        httpStatus.TOO_MANY_REQUESTS
      )
    );
  },
});

module.exports = rateLimiter;
