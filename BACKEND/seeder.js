import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import Pin from "./models/Pin.js";
import clothesMenV1 from "./data/clothesMenV1.js";
import clothesWomenV1 from "./data/clothesWomenV1.js";

dotenv.config();

const DUMMY_USER_ID = "6900ca99e31d149d1efd137c";

const getImagesFromDir = (dir) =>
  fs
    .readdirSync(dir)
    .filter((f) => /\.(jpg|jpeg|png|webp)$/i.test(f))
    .sort(); 

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");

    await Pin.deleteMany();
    console.log("🗑️ Existing pins cleared");

    const menShoesDir = path.join(
      process.cwd(),
      "public/clothes_men/img_database/menshoes"
    );
    const menClothesDir = path.join(
      process.cwd(),
      "public/clothes_men/img_database/menclothes"
    );
    const menAccessoriesDir = path.join(
      process.cwd(),
      "public/clothes_men/img_database/menaccessories"
    );

    const womenClothesDir = path.join(
      process.cwd(),
      "public/clothes_women/Img_database/womenclothes"
    );
    const womenPurseDir = path.join(
      process.cwd(),
      "public/clothes_women/Img_database/womenpurse"
    );

    const menShoes = getImagesFromDir(menShoesDir);
    const menClothes = getImagesFromDir(menClothesDir);
    const menAccessories = getImagesFromDir(menAccessoriesDir);
    const womenClothes = getImagesFromDir(womenClothesDir);
    const womenPurse = getImagesFromDir(womenPurseDir);

    const menPins = clothesMenV1.map((p, i) => {
      const title = p.title.toLowerCase();
      let folder = "menshoes";
      let selectedImages = menShoes;

      if (
        title.includes("shirt") ||
        title.includes("tshirt") ||
        title.includes("hoodie")
      ) {
        folder = "menclothes";
        selectedImages = menClothes;
      } else if (
        title.includes("bag") ||
        title.includes("wallet") ||
        title.includes("accessory")
      ) {
        folder = "menaccessories";
        selectedImages = menAccessories;
      }

      return {
        ...p,
        category: "men",
        tags: p.title.split(",").map((t) => t.trim().toLowerCase()),
        image: p.image, 
        createdBy: DUMMY_USER_ID,
      };
    });

    const womenPins = clothesWomenV1.map((p, i) => {
      const title = p.title.toLowerCase();
      let folder = "womenclothes";
      let selectedImages = womenClothes;

      if (title.includes("purse") || title.includes("bag")) {
        folder = "womenpurse";
        selectedImages = womenPurse;
      }

      return {
        ...p,
        category: "women",
        tags: p.title.split(",").map((t) => t.trim().toLowerCase()),
        image: p.image,
        createdBy: DUMMY_USER_ID,
      };
    });

    await Pin.insertMany([...menPins, ...womenPins]);
    console.log(
      `🎉 ${
        menPins.length + womenPins.length
      } pins imported successfully with correct image paths!`
    );

    process.exit();
  } catch (err) {
    console.error("❌ Error seeding pins:", err);
    process.exit(1);
  }
};

seedData();
