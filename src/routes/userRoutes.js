const express = require("express");
const { body } = require("express-validator");
const userRouter = express.Router();
const { protect } = require("../middlewares/auth.js");

const {
  registerUser,
  login,
  getUsers,
  getProfile,
  updateProfile,
} = require("../controllers/userController.js");

userRouter.get("/", getUsers);

userRouter.get("/profile", protect, getProfile);

userRouter.put("/profile", protect, updateProfile);

module.exports = userRouter;
