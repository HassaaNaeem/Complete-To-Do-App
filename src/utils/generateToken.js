const jwt = require("jsonwebtoken");
const crypto = require("crypto");

require("dotenv").config();

const generateAccessToken = (userId) => {
  const accessToken = jwt.sign({ id: userId }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRE,
  });
  return accessToken;
};
const generateRefreshToken = (userId) => {
  const refreshToken = jwt.sign(
    { id: userId },
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn: process.env.JWT_REFRESH_EXPIRE,
    },
  );
  return refreshToken;
};

const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
  } catch (error) {
    throw new Error("Invalid or Expired access token");
  }
};
const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  } catch (error) {
    throw new Error("Invalid or Expired refresh token");
  }
};

const generatePasswordResetToken = () => {
  const resetToken = crypto.randomBytes(32).toString("hex");
  return resetToken;
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  generatePasswordResetToken,
  verifyRefreshToken,
  verifyAccessToken,
};
