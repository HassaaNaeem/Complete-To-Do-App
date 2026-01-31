require("dotenv").config();

module.exports = {
  PORT: process.env.PORT || 3000,
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  Auth0_SECRET: process.env.Auth0_SECRET,
  CLIENT_ID: process.env.CLIENT_ID,
};
