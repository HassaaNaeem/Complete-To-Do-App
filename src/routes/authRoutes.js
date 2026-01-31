const express = require("express");
const authRouter = express.Router();
const { protect } = require("../middlewares/auth.js");
const {
  register,
  login,
  refreshToken,
  logout,
  logoutAll,
} = require("../controllers/authController.js");

const {
  registerValidator,
  loginValidator,
  refreshTokenValidator,
} = require("../validators/authValidator");

authRouter.post("/register", registerValidator, register);
authRouter.post("/login", loginValidator, login);
authRouter.post("/refresh", refreshTokenValidator, refreshToken);

authRouter.post("/logout", protect, logout);
authRouter.post("/logout-all", protect, logoutAll);
module.exports = authRouter;
