const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/config.js");
const UserModel = require("../models/Users.js");

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

module.exports = auth;
