import json

#  Read the JSON file
with open("inventory.json", "r") as file:
    inventory = json.load(file)

#  Add 'status' based on stock
for item in inventory:
    item["status"] = "In Stock" if item["stock"] > 0 else "Out of Stock"

# Save to updated JSON file
with open("inventory_updated.json", "w") as file:
    json.dump(inventory, file, indent=4)

print("Updated inventory saved as 'inventory_updated.json'")
