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

const setImageUrl = (doc) => {
  if (doc.image) {
    const imageUrl = `${process.env.BASE_URL}/categories/${doc.image}`;
    doc.image = imageUrl;
  }
};

// Works with findAll , findOne and update
categorySchema.post("init", (doc) => {
  setImageUrl(doc);
});

// Works with create
categorySchema.post("save", (doc) => {
  setImageUrl(doc);
});

// 2- Create Model
module.exports = mongoose.model("Category", categorySchema);
