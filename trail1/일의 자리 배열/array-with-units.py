num=list(map(int,input().split()))
new_num=[]
a=num[0]
b=num[1]
new_num.append(a)
new_num.append(b)

for i in range(8):
    c=0
    c=new_num[i]+new_num[i+1]
    if c//10!=0:
        c=c%10
    new_num.append(c)

for z in new_num[::1]:
    print(z,end=" ")
