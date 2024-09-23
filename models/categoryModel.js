const mongoose = require("mongoose");

// 1- Create Schema
const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required!"],
      unique: [true, "Category name must be unique!"],
      minLength: [3, "Too short category name!"],
      maxLength: [32, "Too long category name!"],
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
const CategoryModle = mongoose.model("Category", categorySchema);

module.exports = CategoryModle;
