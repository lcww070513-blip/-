arr = [list(input().split()) for _ in range(5)]
for i in range(5):
    for  j in range(3):
        print(arr[i][j].upper(),end=" ")
    print()
