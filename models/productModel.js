const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Product title is required!"],
      trim: true,
      minlength: [10, "Too short product title!"],
      maxlength: [100, "Too long product title!"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, "Product description is required!"],
      trim: true,
      minlength: [20, "Too short product description!"],
    },
    quantity: {
      type: Number,
      required: [true, "Product quantity is required!"],
    },
    sold: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "Product price is required!"],
      trim: true,
      max: [200000, "Too long product price!"],
    },
    priceAfterDiscount: {
      type: Number,
    },
    colors: [String],
    images: [String],
    coverImage: {
      type: String,
      required: [true, "Product cover image is required!"],
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: [true, "Product must belong to category!"],
    },
    subCategories: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "SubCategory",
      },
    ],
    brand: {
      type: mongoose.Schema.ObjectId,
      ref: "Brand",
    },
    averageRating: {
      type: Number,
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating must can not be more than 5"],
    },
    ratingQuantity: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Mongoose query midddleware to populate category
productSchema.pre(/^find/, function (next) {
  this.populate({
    path: "category",
    select: "name -_id",
  });
  next();
});

module.exports = mongoose.model("Product", productSchema);
