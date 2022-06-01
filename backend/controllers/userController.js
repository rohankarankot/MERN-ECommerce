const mongoose = require("mongoose");
const catchAsyncErorrs = require("../middleware/catchAsyncErrors");
const userModel = require("../models/userModel");
const ErrorHandler = require("../utils/errorHandler");

// register user
exports.registerUser = catchAsyncErorrs(async (req, res, next) => {
  const { name, email, password } = req.body;
  const user = await userModel.create({
    name,
    email,
    password,
    avatar: {
      public_id: "test id",
      url: "test url",
    },
  });
  const token = user.getSignedJwtToken();
  res.status(201).json({
    success: true,
    token,
  });
});

//Login user
exports.loginUser = catchAsyncErorrs(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await userModel.findOne({ email }).select("+password");
  if (!user || !(await user.comparePassword(password))) {
    return next(new ErrorHandler("Incorrect email or password", 401));
  }
  const token = user.getSignedJwtToken();
  res.status(200).json({
    message: "Login Successful",
    success: true,
    token,
  });
});
