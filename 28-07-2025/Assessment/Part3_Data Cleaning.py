import pandas as pd

#  Read CSV
df = pd.read_csv("orders.csv")

#  Fill missing values
df['CustomerName'].fillna('Unknown')
df['Quantity'].fillna(0)
df['Price'].fillna(0)

#  Calculate TotalAmount
df['TotalAmount'] = df['Quantity'] * df['Price']

#  Save cleaned data
df.to_csv("orders_cleaned.csv")

print("Cleaned data saved as 'orders_cleaned.csv'")
