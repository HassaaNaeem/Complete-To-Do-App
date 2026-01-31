const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/config.js");

const auth = (req, res, next) => {
  const token = req.headers.authorization;
  try {
    if (!token) throw new Error();
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Unauthorized Request (Invaid or No Token Provided)",
    });
  }
};

const { verifyAccessToken } = require("../utils/generateToken.js");
const UserModel = require("../models/Users.js");

const protect = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, no token provided",
      });
    }

    const decoded = verifyAccessToken(token);
    const user = await UserModel.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }
    req.userId = user._id;

    req.user = user;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(401).json({
      success: false,
      message: "Not authorized, token failed",
      error: error.message,
    });
  }
};

module.exports = { auth, protect };
