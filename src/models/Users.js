const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const crypto = require("crypto");

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 8,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    refreshTokens: [
      {
        token: {
          type: String,
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
        expiresAt: {
          type: Date,
          required: true,
        },
      },
    ],

    todos: [{ type: Schema.Types.ObjectId, ref: "todos" }],

    resetPasswordToken: String,
    resetPasswordExpire: {
      type: Date,
    },
  },

  {
    timestamps: true,
  },
);

// userSchema.methods.generatePasswordResetToken = () => {
//   const resetToken = crypto.randomBytes(32).toString("hex");
//   this.resetPasswordToken = crypto
//     .createHash("sha256")
//     .update(resetToken)
//     .digest("hex");

//   this.resetPasswordExpire = Date.now() + 10 * 60 * 1000; //  10 minutes
//   return resetToken;
// };

const UserModel = mongoose.model("users", userSchema);

module.exports = UserModel;
