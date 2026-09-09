nums = list(map(int, input().split()))
candidates = []

for n in nums:
    if n == 999 or n == -999:
        break
    candidates.append(n)

print(max(candidates), min(candidates))



