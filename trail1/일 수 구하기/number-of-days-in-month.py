Y = int(input())

if Y == 2:
    print(28)

elif Y <= 7:
    if Y % 2 == 1:
        print(31)
    else:
        print(30)

else:
    if Y % 2 == 1:
        print(30)
    else:
        print(31)