const bcrypt = require("bcryptjs");
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
    },
    passwordChangedAt: Date,
    role: {
      type: String,
      enum: ["user", "manager", "admin"],
      default: "user",
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  // Hasing user password
  this.password = await bcrypt.hash(this.password, 10);

  next();
});

module.exports = mongoose.model("User", userSchema);
