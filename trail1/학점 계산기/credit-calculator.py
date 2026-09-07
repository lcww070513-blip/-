
n = int(input())

grades = list(map(float, input().split()))

target_grades = grades[:n]
total = sum(target_grades)
average = total / n if n > 0 else 0.0


print(f"{average:.1f}")

if average >= 4.0:
    print("Perfect")
elif average >= 3.0:
    print("Good")
else:
    print("Poor")
