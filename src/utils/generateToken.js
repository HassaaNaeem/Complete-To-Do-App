const jwt = require("jsonwebtoken");

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

module.exports = {
  generateAccessToken,
  generateRefreshToken,

  verifyRefreshToken,
  verifyAccessToken,
};
