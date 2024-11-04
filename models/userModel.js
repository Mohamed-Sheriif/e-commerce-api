const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Name required!"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    email: {
      type: String,
      unique: true,
      required: [true, "Email required!"],
      lowercase: true,
    },
    phone: String,
    profileImg: String,
    password: {
      type: String,
      required: [true, "Password required!"],
      minLength: [6, "Password must be at least 6 characters long!"],
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
