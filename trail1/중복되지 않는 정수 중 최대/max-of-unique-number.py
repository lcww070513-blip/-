n = int(input())
arr = list(map(int, input().split()))

max_val = 0
dup = []
for i in range(n):
    if arr[i] in dup:
        continue
    
    if arr[i] in arr[i + 1:]:
        dup.append(arr[i])
        continue

    if arr[i] > max_val:
        max_val = arr[i]

if max_val == 0:
    print(-1)
else:
    print(max_val)



