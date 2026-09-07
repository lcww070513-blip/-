ins = list(map(int,input().split()))
arr = []
for i in ins:
    if i == 0 :
     break
    arr.append(i)
for j in arr[::-1]:
    print(j, end=" ")      

