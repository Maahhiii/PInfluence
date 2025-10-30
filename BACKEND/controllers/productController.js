import Product from "../models/productModel.js";

// @desc Get all products
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch products" });
  }
};

// @desc Get single product by ID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch product" });
  }
};

// @desc Search products
export const searchProducts = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.json([]);

    const regex = new RegExp(q, "i"); // case-insensitive
    const products = await Product.find({
      $or: [{ title: regex }, { tags: regex }],
    });

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Search failed" });
  }
};

// @desc Add new product (admin only, optional)
export const addProduct = async (req, res) => {
  try {
    const { image, title, shopLink, category, tags } = req.body;

    if (!image || !title || !shopLink)
      return res.status(400).json({ message: "Missing required fields" });

    const product = await Product.create({
      image,
      title,
      shopLink,
      category,
      tags: tags || title.split(",").map((t) => t.trim()),
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: "Failed to add product" });
  }
};
