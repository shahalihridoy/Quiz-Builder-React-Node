const catchAsync = (fun) => (req, res, next) => fun(req, res, next).catch(next);

module.exports = catchAsync;
