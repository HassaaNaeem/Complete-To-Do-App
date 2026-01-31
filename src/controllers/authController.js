const UserModel = require("../models/Users.js");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/generateToken.js");

const register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }
    const { name, email, password } = req.body;

    const existingUser = await UserModel.findOne({ email }); // finding if the email is already registered
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 3);
    const user = await UserModel.create({
      name,
      password: hashedPassword,
      email,
    });

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshTokens.push({
      token: refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });
    await user.save();

    res.status(201).json({
      success: true,
      message: "User is registered",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      accessToken,
      refreshToken,
      expiresIn: 120,
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({
      success: false,
      message: "Registration failed",
      error: error.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const { email, password } = req.body;
    const user = await UserModel.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email",
      });
    }

    const matchedPassword = await bcrypt.compare(password, user.password);
    if (!matchedPassword) {
      return res.status(401).json({
        success: false,
        message: "Invalid password",
      });
    }
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshTokens.push({
      token: refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });
    await user.save();

    res.status(201).json({
      success: true,
      message: "Login Successful",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      accessToken,
      refreshToken,
      expiredIn: 120,
    });
  } catch (error) {
    console.error("Login Error: " + error);
    res.status(500).json({
      success: false,
      message: "Login Failed",
      error: error.message,
    });
  }
};

const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Refresh token is required",
      });
    }
    const { verifyRefreshToken } = require("../utils/generateToken.js");
    let decoded;
    try {
      decoded = verifyRefreshToken(refreshToken);
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired refresh token",
      });
    }

    const user = await UserModel.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    const tokenExists = user.refreshTokens.some(
      (t) => t.token == refreshToken && Date.now() < t.expiresAt,
    );
    if (!tokenExists) {
      return res.status(401).json({
        success: false,
        message: "Refresh token is invalid or has been revoked",
      });
    }

    const newAccessToken = generateAccessToken(user._id);
    res.status(201).json({
      success: true,
      message: "Token refreshed successfully",
      data: {
        accessToken: newAccessToken,
        expiresIn: 120, // 2 minutes
      },
    });
  } catch (error) {
    console.error("Refresh token error: " + error);
    return res.status(500).json({
      success: false,
      message: "Failed to refresh token",
      error: error.message,
    });
  }
};

const logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: "Refresh token is required",
      });
    }

    const userId = req.userId;
    // console.log("userId: " + userId);
    // console.log("req.userId: " + req.userId);
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    user.refreshTokens = user.refreshTokens.filter(
      (t) => t.token !== refreshToken,
    );
    await user.save();
    res.status(201).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Logout error: " + error);
    res.status(500).json({
      success: false,
      message: "Logout failed",
      error: error.message,
    });
  }
};

const logoutAll = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    user.refreshTokens = [];
    await user.save();

    res.status(201).json({
      success: true,
      message: "Logged out from all devices successfully",
    });
  } catch (error) {
    console.error("Logout all error: " + error);
    res.status(500).json({
      success: false,
      message: "Logout failed",
      error: error.message,
    });
  }
};

module.exports = {
  register,
  login,
  refreshToken,
  logout,
  logoutAll,
};
