from transformers import BlipProcessor, BlipForConditionalGeneration
from PIL import Image
import os
import json
import re

def extract_tags(caption):
    # Lowercase and split by space and punctuation
    words = re.findall(r'\b\w+\b', caption.lower())
    # Remove very common or useless words
    stopwords = {"a", "the", "on", "with", "and", "in", "of", "for", "to", "is", "at"}
    tags = [word for word in words if word not in stopwords]
    return ", ".join(tags)


processor = BlipProcessor.from_pretrained("Salesforce/blip-image-captioning-base")
model = BlipForConditionalGeneration.from_pretrained("Salesforce/blip-image-captioning-base")

FOLDERS = {
    "clothesMen": "./clothes_men/img_database",
    "clothesWomen": "./clothes_women/img_database"
}

def extract_tags(caption):
    
    words = re.findall(r'\b\w+\b', caption.lower())
    
    stopwords = {"a", "the", "on", "with", "and", "in", "of", "for", "to", "is", "at"}
    tags = [word for word in words if word not in stopwords]
    return ", ".join(tags)


def generate_tags(image_path):
    raw_image = Image.open(image_path).convert('RGB')
    inputs = processor(raw_image, return_tensors="pt")
    out = model.generate(**inputs, max_new_tokens=20)
    caption = processor.decode(out[0], skip_special_tokens=True)
    return caption

def process_folder(name, folder_path):
    output_data = []

    for filename in os.listdir(folder_path):
        if filename.lower().endswith(('.jpg', '.jpeg', '.png')):
            image_path = os.path.join(folder_path, filename)
            print(f"Processing {filename} in {name}...")
            try:
                tags = generate_tags(image_path)
                tag_string = extract_tags(tags)
                output_data.append({
                    "image": f"/{name.lower().replace('clothes', 'clothes_')}/img_database/{filename}",
                    "title": tag_string,
                    "shopLink": "https://your-shop-link.com"
                })
            except Exception as e:
                print(f"Error on {filename}: {e}")

    out_file = f"./output/{name}.generated.js"
    with open(out_file, "w") as f:
        f.write(f"export const {name} = ")
        json.dump(output_data, f, indent=2)
        f.write(";")

    print(f"Done: {out_file}")

for key, path in FOLDERS.items():
    process_folder(key, path)
