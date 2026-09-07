n = list(map(int,input().split()))
count = 0
toatl = 0
for num in n :
    if num == 0:
        break
    if num % 2 == 0:
        count += 1
        toatl += num
print(count,toatl)
