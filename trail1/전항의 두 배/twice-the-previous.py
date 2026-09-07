a, b = map(int, input().split())
for x in range(10):
    if x % 2== 0:
        print(a,end=" ")
        a = b + 2*a
    else:
        print(b, end=" ")
        b = a + 2*b
