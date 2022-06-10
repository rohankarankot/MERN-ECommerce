const mongoose = require("mongoose");
const catchAsyncErorrs = require("../middleware/catchAsyncErrors");
const User = require("../models/userModel");
const ErrorHandler = require("../utils/errorHandler");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");

// register user
exports.registerUser = catchAsyncErorrs(async (req, res, next) => {
  const { name, email, password } = req.body;
  const user = await User.create({
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
  const user = await User.findOne({ email }).select("+password");
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
  const user = await User.findOne({ email });
  if (!user) {
    return next(new ErrorHandler("No user found with this email", 404));
  }
  const resetToken = User.createPasswordResetToken();
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

//get user details
exports.getUserDetails = catchAsyncErorrs(async (req, res, next) => {
  console.log(req.user.id);
  const user = await User.findById(req.user.id)
    .select("-password")
    .select("-_id")
    .select("-__v");
  res.status(200).json({
    status: "success",
    user,
  });
});

//change password
exports.changePassword = catchAsyncErorrs(async (req, res, next) => {
  const { password, newPassword } = req.body;
  if (!password || !newPassword) {
    return next(
      new ErrorHandler("Please provide password and new password", 400)
    );
  }

  const user = await User.findById(req.user.id).select("+password");
  if (!(await user.comparePassword(password))) {
    return next(new ErrorHandler("old password is Incorrect", 401));
  }
  user.password = newPassword;
  await user.save();
  sendToken(user, 200, res);
});

// update user details
exports.updateUserDetails = catchAsyncErorrs(async (req, res, next) => {
  //todo: update avatar
  const newData = {
    name: req.body.name,
    email: req.body.email,
  };
  await User.findByIdAndUpdate(req.user.id, newData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    status: "success",
    message: "user details updated successfully",
  });
});

//get all users -- admin only
exports.getAllUsers = catchAsyncErorrs(async (req, res, next) => {
  const users = await User.find({}).select("-password").select("-__v");
  res.status(200).json({
    status: "success",
    users,
  });
});

// get single user -- admin only
exports.getSingleUser = catchAsyncErorrs(async (req, res, next) => {
  const user = await User.findById(req.params.id)
    .select("-password")
    .select("-_id")
    .select("-__v");
  if (!user) {
    return next(new ErrorHandler("No user found with this id", 404));
  }

  res.status(200).json({
    status: "success",
    user,
  });
});

// update user role --admin only
exports.updateUserRole = catchAsyncErorrs(async (req, res, next) => {
  const newData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };
  await User.findByIdAndUpdate(req.params.id, newData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    status: "success",
    message: `user role updated to ${newData.role} successfully`,
  });
});

// delete user details -- admin only
exports.deleteUser = catchAsyncErorrs(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) return next(new ErrorHandler("No user found", 404));
  await user.remove();

  //todo: delete avatar
  res.status(200).json({
    status: "success",
    message: "user Deleted successfully",
  });
});
