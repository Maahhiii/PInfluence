import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    shopLink: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ["men", "women", "unisex"],
      default: "unisex",
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
