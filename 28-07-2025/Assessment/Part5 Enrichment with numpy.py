import numpy as np
import pandas as pd


np.random.seed(0)  
scores = np.random.randint(35, 101, size=20)

#Count scores > 75
count_above_75 = np.sum(scores > 75)

# Step 3: Calculate mean and standard deviation
mean_score = np.mean(scores)
std_dev_score = np.std(scores)

# Create DataFrame and save to CSV
df = pd.DataFrame({'StudentID': range(1, 21), 'Score': scores})
df.to_csv("scores.csv", index=False)

# Print results
print("Generated Scores:", scores)
print("Number of students scoring above 75:", count_above_75)
print("Mean score:", round(mean_score, 2))
print("Standard Deviation:", round(std_dev_score, 2))
