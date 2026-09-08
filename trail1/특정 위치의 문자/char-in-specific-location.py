arr = ['L', 'E', 'B', 'R', 'O', 'S']
target = input()

idx = -1

for i, char in enumerate(arr):
    if char == target:
        idx = i
        break

if idx != -1:
    print(idx)
else:
    print("None")
