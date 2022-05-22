const ErrorHandler = require("../utils/errorHandler");
module.exports = (err, req, res, next) => {
  err.status = err.status || 500;
  err.message = err.message || "Something went wrong";
  res.status(err.status).json({
    success: false,
    error: err.status,
    message: err.message,
    errorAt: err.stack,
  });
};
