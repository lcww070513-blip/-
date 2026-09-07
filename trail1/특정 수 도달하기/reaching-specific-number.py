nums = list(map(int, input().split()))

total = 0
count = 0

for num in nums:
    if num > 250:
        break
    total += num
    count += 1


if count > 0:
    average = total / count
else:
    average = 0.0

print(total, f"{average:.1f}")
