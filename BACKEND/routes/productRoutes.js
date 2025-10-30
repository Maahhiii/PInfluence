import express from "express";
import {
  getProducts,
  getProductById,
  searchProducts,
  addProduct,
} from "../controllers/productController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", getProducts);
router.get("/search", searchProducts);
router.get("/:id", getProductById);

// Protected (admin) route
router.post("/", protect, addProduct);

export default router;
