const mongoose = require("mongoose");

// 1- Create Schema
const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Brand name is required!"],
      unique: [true, "Brand name must be unique!"],
      minLength: [3, "Too short brand name!"],
      maxLength: [32, "Too long brand name!"],
    },
    // slug replace spaces with -
    // ex =>  A and B => a-and-b
    slug: {
      type: String,
      lowercase: true,
    },
    image: String,
  },
  { timestamps: true }
);

// 2- Create Model
module.exports = mongoose.model("Brand", brandSchema);
