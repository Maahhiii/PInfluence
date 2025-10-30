import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import Pin from "./models/Pin.js";
import clothesMenV1 from "./data/clothesMenV1.js";
import clothesWomenV1 from "./data/clothesWomenV1.js";

dotenv.config();

const DUMMY_USER_ID = "6900ca99e31d149d1efd137c"; // replace with your existing user ID

// ✅ Helper: Read all image files safely
const getImagesFromDir = (dir) =>
  fs
    .readdirSync(dir)
    .filter((f) => /\.(jpg|jpeg|png|webp)$/i.test(f))
    .sort(); // keep consistent order

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");

    await Pin.deleteMany();
    console.log("🗑️ Existing pins cleared");

    // ✅ Define all folders
    const menShoesDir = path.join(process.cwd(), "public/clothes_men/img_database/menshoes");
    const menClothesDir = path.join(process.cwd(), "public/clothes_men/img_database/menclothes");
    const menAccessoriesDir = path.join(process.cwd(), "public/clothes_men/img_database/menaccessories");

    const womenClothesDir = path.join(process.cwd(), "public/clothes_women/img_database/womenclothes");
    const womenPurseDir = path.join(process.cwd(), "public/clothes_women/img_database/womenpurse");

    // ✅ Read images
    const menShoes = getImagesFromDir(menShoesDir);
    const menClothes = getImagesFromDir(menClothesDir);
    const menAccessories = getImagesFromDir(menAccessoriesDir);
    const womenClothes = getImagesFromDir(womenClothesDir);
    const womenPurse = getImagesFromDir(womenPurseDir);

    // ✅ Create category-based mapping for Men
    const menPins = clothesMenV1.map((p, i) => {
      const title = p.title.toLowerCase();
      let folder = "menshoes";
      let selectedImages = menShoes;

      if (title.includes("shirt") || title.includes("tshirt") || title.includes("hoodie")) {
        folder = "menclothes";
        selectedImages = menClothes;
      } else if (title.includes("bag") || title.includes("wallet") || title.includes("accessory")) {
        folder = "menaccessories";
        selectedImages = menAccessories;
      }

      const imageFile = selectedImages[i % selectedImages.length];
      return {
        ...p,
        category: "men",
        tags: p.title.split(",").map((t) => t.trim().toLowerCase()),
        image: `/clothes_men/img_database/${folder}/${imageFile}`,
        createdBy: DUMMY_USER_ID,
      };
    });

    // ✅ Create category-based mapping for Women
    const womenPins = clothesWomenV1.map((p, i) => {
      const title = p.title.toLowerCase();
      let folder = "womenclothes";
      let selectedImages = womenClothes;

      if (title.includes("purse") || title.includes("bag")) {
        folder = "womenpurse";
        selectedImages = womenPurse;
      }

      const imageFile = selectedImages[i % selectedImages.length];
      return {
        ...p,
        category: "women",
        tags: p.title.split(",").map((t) => t.trim().toLowerCase()),
        image: `/clothes_women/img_database/${folder}/${imageFile}`,
        createdBy: DUMMY_USER_ID,
      };
    });

    // ✅ Insert data
    await Pin.insertMany([...menPins, ...womenPins]);
    console.log(
      `🎉 ${menPins.length + womenPins.length} pins imported successfully with correct image paths!`
    );

    process.exit();
  } catch (err) {
    console.error("❌ Error seeding pins:", err);
    process.exit(1);
  }
};

seedData();
