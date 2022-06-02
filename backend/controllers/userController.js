const mongoose = require("mongoose");
const catchAsyncErorrs = require("../middleware/catchAsyncErrors");
const userModel = require("../models/userModel");
const ErrorHandler = require("../utils/errorHandler");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");

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
  sendToken(user, 201, res);
});

//Login user
exports.loginUser = catchAsyncErorrs(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ErrorHandler("Please provide email and password", 400));
  }
  const user = await userModel.findOne({ email }).select("+password");
  if (!user || !(await user.comparePassword(password))) {
    return next(new ErrorHandler("Incorrect email or password", 401));
  }
  const token = user.getSignedJwtToken();
  sendToken(user, 200, res);
});

//Logout user
exports.logoutUser = catchAsyncErorrs(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({
    status: "success",
    message: "Logged out successfully",
  });
});

// forgot password
exports.forgotPassword = catchAsyncErorrs(async (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    return next(new ErrorHandler("Please provide email", 400));
  }
  const user = await userModel.findOne({ email });
  if (!user) {
    return next(new ErrorHandler("No user found with this email", 404));
  }
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });
  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/password/reset/${resetToken}`;
  const message = `You are receiving this email because you (or someone else) has requested the reset of a password. \n\n ${resetUrl} \n\n If you did not request this, please ignore this email and your password will remain unchanged.`;
  try {
    await sendEmail({
      email: user.email,
      subject: "Password reset link",
      message,
    });
    res.status(200).json({
      status: "success",
      message: `password reset link sent to ${user.email}`,
    });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save({ validateBeforeSave: false });
    return next(new ErrorHandler(error, 500));
  }
});
