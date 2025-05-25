const express = require("express");
const {
  register,
  resendOtp,
  verifyOTP,
  login,
  submitEnterpriseForm,
  getUser,
  refreshToken,
  logout,
  getUserById,
} = require("../controllers/authController");
const { isLogin } = require("../middlewares/isLogin");
const { checkAuthStatus } = require("../middlewares/checkAuthMiddleware");

const router = express.Router();

router.post("/register", register);
router.post("/resend-otp", resendOtp);
router.post("/verify-otp", verifyOTP);
router.post("/login", login);
router.post("/refresh-token", refreshToken);
router.post("/get-user", isLogin, getUser);
router.get("/get-user/:userId", isLogin, getUserById);
router.get("/auth-status", checkAuthStatus);
router.post("/enterprise/form", isLogin, submitEnterpriseForm);
router.post("/logout", isLogin, logout);

module.exports = router;
