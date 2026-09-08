A, B = map(int, input().split())
remainder_count = {}

for i in range(1000):
    if A <= 1:
        break

    remainder = A % B
    remainder_count[remainder] = remainder_count.get(remainder, 0) + 1
    A //= B

answer = 0

for count in remainder_count.values():
    answer += count ** 2

print(answer)


