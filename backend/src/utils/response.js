const httpStatus = require("http-status");

exports.successfulResponse = (res, data) =>
  res.status(httpStatus.OK).json({
    status: "success",
    ...data,
  });
