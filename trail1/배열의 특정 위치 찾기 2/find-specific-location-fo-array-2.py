n = list(map(int, input().split()))

arr = len(n)

odd_sum = 0
even_sum = 0

for i in range(0, arr, 2):
    odd_sum += n[i]

for j in range(1, arr, 2):
    even_sum += n[j]  

print(max(odd_sum,even_sum)-min(odd_sum,even_sum))