const express = require("express");
const { body } = require("express-validator");
const userRouter = express.Router();
const auth = require("../middlewares/auth.js");
const {
  registerUser,
  login,
  getUsers,
  getProfile,
  updateProfile,
} = require("../controllers/userController.js");

userRouter.post(
  "/register",
  body("name").notEmpty().withMessage("Please Enter Name"),
  body("email")
    .notEmpty()
    .trim()
    .isEmail()
    .withMessage("Invalid Email Address"),
  body("password")
    .notEmpty()
    .isLength({ min: 8 })
    .withMessage("Password must contain at least 8 characters")
    .matches(/[A-Z]/)
    .withMessage("Password must contain an uppercase letter")
    .matches(/\d/) // \d means 0 - 9
    .withMessage("Password must contain a number")
    .matches(/[^A-Za-z0-9]/)
    .withMessage("Password must contain a special character"),
  registerUser,
);

userRouter.get("/", getUsers);

userRouter.post("/login", login);

userRouter.get("/profile", auth, getProfile);

userRouter.put("/profile", auth, updateProfile);

module.exports = userRouter;
