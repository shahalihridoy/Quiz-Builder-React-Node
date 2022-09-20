const { getUserFromToken } = require("../controllers/auth.controller");
const catchAsync = require("../utils/catchAsync");

exports.protectRoute = catchAsync(async (req, res, next) => {
  const user = await getUserFromToken(req, res, next);
  req.user = user;
  next();
});
