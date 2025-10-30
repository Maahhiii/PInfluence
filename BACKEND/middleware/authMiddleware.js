import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  let token;
  try {
    if (req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select("-password");
      if (!user) return res.status(401).json({ message: "Not authorized" });
      req.user = user;
      next();
    } else {
      return res.status(401).json({ message: "No token provided" });
    }
  } catch (err) {
    console.error("Auth error:", err);
    return res.status(401).json({ message: "Token is invalid or expired" });
  }
};
