item_cnt = {
    1:0,2:0,3:0,4:0,5:0,6:0,7:0,8:0,9:0
}
n = int(input())
lst=  list(map(int,input().split()))

for i in range(len(lst)):
    item_cnt[lst[i]] +=1


for cnt in item_cnt.values():
    print(cnt)
