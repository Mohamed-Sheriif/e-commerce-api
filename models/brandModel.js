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

const setImageUrl = (doc) => {
  if (doc.image) {
    const imageUrl = `${process.env.BASE_URL}/brands/${doc.image}`;
    doc.image = imageUrl;
  }
};

// Works with findAll , findOne and update
brandSchema.post("init", (doc) => {
  setImageUrl(doc);
});

// Works with create
brandSchema.post("save", (doc) => {
  setImageUrl(doc);
});

// 2- Create Model
module.exports = mongoose.model("Brand", brandSchema);
