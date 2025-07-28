import json

# Read the JSON file
# Increase all prices by 10%
# Save the updated list to a new JSON file
with open("products.json", "r") as file:
    products = json.load(file)


for product in products:
    product["price"] = round(product["price"] * 1.10, 2)

with open("products_updated.json", "w") as file:
    json.dump(products, file, indent=4)

print("Updated prices saved to 'products_updated.json'.")
