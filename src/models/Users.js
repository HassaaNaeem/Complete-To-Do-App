const mongoose = require("mongoose");
const Schema = mongoose.Schema;

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
  },

  {
    timestamps: true,
  },
);

const UserModel = mongoose.model("users", userSchema);

module.exports = UserModel;
