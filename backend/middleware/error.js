const ErrorHandler = require("../utils/errorHandler");
module.exports = (err, req, res, next) => {
  err.status = err.status || 500;
  err.message = err.message || "Something went wrong";

  //wronge Mongo ID
  err.message.split(" ").map((m) => {
    if (m.startsWith("Cast")) {
      err.message = `(CastError) Resource not Found, Invalid ${err.path}`;
      res.status(err.status).json({
        status: 400,
        message: err.message,
      });
      return;
    }
  });

  //mongodb duplicate key error
  if (err.code === 11000) {
    err.message = `User already exists, Please login or use another email`;
    res.status(err.status).json({
      status: 400,
      message: err.message,
    });
    return;
  }

  res.status(err.status).json({
    success: false,
    error: err.status,
    message: err.message,
    errorAt: err.stack,
  });
};
