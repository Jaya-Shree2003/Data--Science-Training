import pandas as pd
import numpy as np

# Read the cleaned CSV
df = pd.read_csv("students_cleaned.csv")

# Add Status column using conditions
df['Status'] = np.where(df['Score'] >= 85, 'Excellent',
                np.where(df['Score'] >= 60, 'Passed', 'Failed'))

# Add Tax_ID column
df['Tax_ID'] = df['ID'].apply(lambda x: f"TAX-{x}")

# To write in the file
df.to_csv("students_transformed.csv", index=False)

print("Transformation complete. Saved as 'students_transformed.csv'.")
