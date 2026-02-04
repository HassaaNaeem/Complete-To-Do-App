const express = require("express");
const authRouter = express.Router();
const { protect } = require("../middlewares/auth.js");
const {
  register,
  login,
  refreshToken,
  logout,
  logoutAll,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController.js");

const {
  registerValidator,
  loginValidator,
  refreshTokenValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
} = require("../validators/authValidator");

authRouter.post("/register", registerValidator, register);
authRouter.post("/login", loginValidator, login);
authRouter.post("/refresh", refreshTokenValidator, refreshToken);

authRouter.post("/logout", protect, logout);
authRouter.post("/logout-all", protect, logoutAll);

authRouter.post("/forgot-password", forgotPasswordValidator, forgotPassword);
authRouter.put("/reset-password/:token", resetPasswordValidator, resetPassword);
module.exports = authRouter;
