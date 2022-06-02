const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  forgotPassword,
} = require("../controllers/userController");

const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(logoutUser);
router.route("/password/forgot").post(forgotPassword);
module.exports = router;
