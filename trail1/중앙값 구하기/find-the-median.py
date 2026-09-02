a,b,c = map(int,input().split())

if (a>c and a<b) or (c>a and a>b):
    print(a)
elif (b>c and b<a) or (c>b and b>a):
    print(b)
else:
    print(c)