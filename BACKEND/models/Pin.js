import mongoose from "mongoose";

const pinSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    image: { type: String, required: true }, // path (e.g. /uploads/pins/...)
    shopLink: { type: String },
    tags: [{ type: String }],
    category: { type: String, enum: ["men", "women", "unisex"], default: "unisex" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
  },
  { timestamps: true }
);

export default mongoose.model("Pin", pinSchema);
