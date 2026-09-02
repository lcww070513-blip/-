a,c=map(int,input().split())
b,d=map(int,input().split())
if a>b :
    print("A")
elif b>a :
    print("B")
elif a == b and c>d :
    print("A")
else :
    print("B")