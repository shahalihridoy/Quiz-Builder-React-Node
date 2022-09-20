const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const httpStatus = require("http-status");
const User = require("../models/user.model");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const { successfulResponse } = require("../utils/response");

const createToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

const getUserFromToken = async (req, res, next) => {
  const jwtToken = req.headers.authorization;
  if (!jwtToken) {
    return next(new AppError("No token was provided", httpStatus.UNAUTHORIZED));
  }
  const [, token] = jwtToken.split(" ");
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.id).lean();
  if (!user) {
    return next(new AppError("Invalid token", httpStatus.UNAUTHORIZED));
  }
  return user;
};

exports.getUserFromToken = getUserFromToken;

exports.verifyToken = catchAsync(async (req, res, next) => {
  const user = await getUserFromToken(req, res, next);
  return successfulResponse(res, { data: user });
});

exports.register = catchAsync(async (req, res) => {
  const newUser = await User.create(req.body);
  const token = createToken(newUser._id);
  newUser.password = undefined;

  return successfulResponse(res, { data: newUser, token });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(
      new AppError("Please provide email and password", httpStatus.BAD_REQUEST)
    );
  }

  const user = await User.findOne({ email }).select("+password");
  const hasValidPassword = await user?.checkPassword(password, user.password);

  if (!user || !hasValidPassword) {
    return next(
      new AppError("Incorrect email or password", httpStatus.UNAUTHORIZED)
    );
  }

  const token = createToken(user._id);
  user.password = undefined;

  return successfulResponse(res, { data: user, token });
});
