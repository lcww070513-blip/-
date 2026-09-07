n = int(input())

arr = []
count = 0
i = 1

while count < 2:
    value = n * i
    arr.append(value)

    if value % 5 == 0:
        count += 1

    i += 1
print(*arr)