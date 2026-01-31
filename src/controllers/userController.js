const UserModel = require("../models/Users");
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/config.js");

const registerUser = async (req, res) => {
  const { name, password, email } = req.body;
  try {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({
        errors: result.array(),
      });
    }
    const hashedPassword = await bcrypt.hash(password, 3);
    await UserModel.create({
      name: name,
      email: email,
      password: hashedPassword,
    });
    return res.json({
      message: "User registered",
    });
  } catch (err) {
    res.status(500).json({
      message: "User already exists",
    });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await UserModel.findOne({ email: email });
  if (!user) {
    res.status(404).json({
      message: "User with this email doesn't exists",
    });
    return;
  }
  const matchedPassword = await bcrypt.compare(password, user.password);
  if (!matchedPassword) {
    res.status(400).json({
      message: "Incorrect password",
    });
    return;
  }
  const token = jwt.sign({ id: user._id }, JWT_SECRET);
  res.json({
    message: "User logged in",
    user: user,
    token: token,
  });
};

const getUsers = async (req, res) => {
  const users = await UserModel.find({});
  res.json({
    users: users,
  });
};

const getProfile = async (req, res) => {
  const userId = req.userId; // req.id will contain id from auth middleware
  const user = await UserModel.findOne({ _id: userId })
    .populate("todos")
    .exec();
  // if (!user) {
  //   res.status(404).json({
  //     message: "User not found",
  //   });
  //   return;
  // } // we dont need this as we have an auth middleware

  console.log(JSON.stringify(req.oidc.user));
  res.json({
    Name: user.name,
    Email: user.email,
    Todos: user.todos,
  });
};

const updateProfile = async (req, res) => {
  const userId = req.userId; // req.id will contain id from auth middleware
  const updatedName = req.body.name;
  const updatedPassword = req.body.password;
  const updatedData = {};
  if (updatedName) {
    updatedData.name = updatedName;
  }
  if (updatedPassword) {
    const hashedPassword = await bcrypt.hash(updatedPassword, 3);
    updatedData.password = hashedPassword;
  }

  const updatedUser = await UserModel.updateOne(
    { _id: userId },
    {
      $set: updatedData,
    },
    {
      new: true,
    },
  );
  res.json({
    message: "User updated",
    User: updatedUser,
  });
};

module.exports = {
  registerUser,
  login,
  getUsers,
  getProfile,
  updateProfile,
};
