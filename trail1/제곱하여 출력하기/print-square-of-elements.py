n = int(input())
numbers = list(map(int, input().split()))
new_arr = [elem * elem for elem in numbers]
print(*new_arr)




