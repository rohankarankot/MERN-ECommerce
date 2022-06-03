const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  forgotPassword,
  getUserDetails,
  changePassword,
  updateUserDetails,
} = require("../controllers/userController");
const { isAuthenticatedUser } = require("../middleware/auth");

const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(logoutUser);
router.route("/me").get(isAuthenticatedUser, getUserDetails);
router.route("/password/forgot").post(forgotPassword);
router.route("/password/update").put(isAuthenticatedUser, changePassword);
router.route("/me/update").put(isAuthenticatedUser, updateUserDetails);
module.exports = router;
