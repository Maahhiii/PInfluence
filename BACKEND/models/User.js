import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    username: { type: String, required: false, unique: false },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    birthdate: { type: String },
    profilePic: { type: String }, // path to uploads
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    boards: [{ type: mongoose.Schema.Types.ObjectId, ref: "Board" }],
    pins: [{ type: mongoose.Schema.Types.ObjectId, ref: "Pin" }]
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("User", userSchema);
