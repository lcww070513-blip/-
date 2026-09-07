
numbers = list(map(int, input().split()))

total = 0
count = 0

for num in numbers:
    if num == 0:
        break

    total += num
    count += 1

average = total / count
print(total, f"{average:.1f}")