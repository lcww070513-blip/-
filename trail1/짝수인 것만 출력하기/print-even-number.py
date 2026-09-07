n = int(input())
x = list(map(int, input().split()))

flag = []

for i in range(n):
    if x[i] % 2 == 0:
        flag.append(x[i])
print(*flag)

 


