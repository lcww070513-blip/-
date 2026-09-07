# n = list(map(int,input().split()))
# sum_num = 0


# for i in range(n+1):
#     if i == 0:
#         sum_num = n[i::-1] + n[i-1::-1] + n[i-2::-1]
# print(sum_num)

n = list(map(int, input().split()))

for i in range(len(n)):
    if n[i] == 0:
        print(n[i - 1]+ n[i - 2]+n[i - 3])
        break
