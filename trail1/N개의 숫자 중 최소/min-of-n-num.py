n = int(input())
nums = list(map(int, input().split()))
min_val = nums[0]
cnt = 0
for i in range(len(nums)):
    if min_val > nums[i]:
        min_val = nums[i]
for j in range(len(nums)):
    if min_val == nums[j]:
        cnt+=1
print(min_val,cnt)

