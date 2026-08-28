a,b,c=list(map(int,input().split()))
print(sum([a,b,c]))
print(sum([a,b,c])//len([a,b,c]))
print(sum([a,b,c])-(sum([a,b,c])//len([a,b,c])))
