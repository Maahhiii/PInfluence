import json
import os
import re
import demjson3

def load_js_array(filepath):
    with open(filepath, "r") as f:
        content = f.read()
        match = re.search(r"const \w+\s*=\s*(\[\s*.*?\s*\])", content, re.DOTALL)
        if not match:
            raise ValueError(f"Cannot find exported array in {filepath}")
        js_array = match.group(1)
        return demjson3.decode(js_array)  

def update_titles(existing_path, generated_path):
    existing_data = load_js_array(existing_path)
    generated_data = load_js_array(generated_path)

    title_map = {
        os.path.basename(item["image"]): item["title"]
        for item in generated_data
    }

    for item in existing_data:
        filename = os.path.basename(item["image"])
        if filename in title_map:
            item["title"] = title_map[filename]

    export_name = os.path.splitext(os.path.basename(existing_path))[0]
    with open(existing_path, "w") as f:
        f.write(f"export const {export_name} = ")
        json.dump(existing_data, f, indent=2)
        f.write(";")

    print(f"Titles updated in {existing_path}")

update_titles(
    existing_path="../src/data/clothesMen.js",
    generated_path="output/clothesMen.generated.js"
)

update_titles(
    existing_path="../src/data/clothesWomen.js",
    generated_path="output/clothesWomen.generated.js"
)
