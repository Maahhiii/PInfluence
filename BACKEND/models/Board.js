import mongoose from "mongoose";

const boardSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    pins: [{ type: mongoose.Schema.Types.ObjectId, ref: "Pin" }],
    coverImage: { type: String }
  },
  { timestamps: true }
);

export default mongoose.model("Board", boardSchema);
