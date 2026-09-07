n = int(input())

arr = [1, n]

while True:
    next_num = arr[-2] + arr[-1]

    arr.append(next_num)

    if next_num > 100:
        break
print(*arr) 
    

    
