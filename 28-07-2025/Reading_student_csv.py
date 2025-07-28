import pandas as pd

# Read the CSV file
df = pd.read_csv("student.csv")

# Fill missing Age with average age (ignoring NaNs)
average_age = df['Age'].mean()
df['Age'].fillna(average_age)

# Fill missing Score with 0
df['Score'].fillna(0)

# Save the cleaned data
df.to_csv("students_cleaned.csv", index=False)

print("Cleaned data saved as 'students_cleaned.csv'")
