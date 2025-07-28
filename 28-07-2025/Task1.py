# #Using a function to check a number is prime or not
# def is_prime(a):
#     for i in range(2,a):
#         if a%i==0:
#             return False
#
#     return True;
#
# n=int(input("Enter the number to be checked: "))
#
# if is_prime(n):
#     print(f"{n} is a prime number")
# else:
#     print(f"{n} is not a prime number")

#Reverses a String
# str1=input("Enter the string: ")
# print(str1[::-1])
# if str1==str1[::-1]:
#
#     print(f"{str1} is a palindrome ")
# else:
#     print(f"{str1} is not a palindrome")

#Array Manupulation
#Remove duplicates
#Sort array
#Second Largest
def remove_duplicates(arr):
    unique = []
    for num in arr:
        if num not in unique:
            unique.append(num)
    return unique

arr = [1, 2, 2, 3, 4, 4, 4, 5, 5]
unique_arr = remove_duplicates(arr)

# Print unique elements
for num in unique_arr:
    print(num, end=" ")

# Find second largest
sorted_arr = sorted(unique_arr)
print("\nSecond Largest:", sorted_arr[-2])

