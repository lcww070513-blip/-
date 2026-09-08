n,m = map(int,input().split())
s = list(map(int,input().split()))
flag =0
for i in range(n):
   if s[i] == m :
    flag+=1
print(flag)

    