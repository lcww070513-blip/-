count = {
    1: 0, 2: 0, 3: 0,
    4: 0, 5: 0, 6: 0,
    7: 0, 8: 0, 9: 0
}

numbers = list(map(int, input().split()))

for num in numbers:
    if num == 0:
        break

    tens = num // 10

    if tens != 0:
        count[tens] += 1

for digit, cnt in count.items():
    print(f"{digit} - {cnt}")
