# Part 1: Python Basics
# 🔸Q1. Write a Python function factorial(n) using a loop.
# Don’t use math.factorial().
# 🔸Q2. Create a list of tuples like this:
# [("Aarav", 80), ("Sanya", 65), ("Meera", 92), ("Rohan", 55)] Write code to:
# Print only names of students scoring above 75
# Calculate and print average score

def factorial(n):
    result = 1
    for i in range(2, n + 1):
        result *= i
    return result

print("Factorial of 5 is:", factorial(5))

# Print names of students scoring above 75
students = [("Aarav", 80), ("Sanya", 65), ("Meera", 92), ("Rohan", 55)]
print("Students scoring above 75:")
for name, score in students:
    if score > 75:
        print(name)

# Calculate and print average score
total_score = sum(score for _, score in students)
average_score = total_score / len(students)
print("Average Score:", average_score)


