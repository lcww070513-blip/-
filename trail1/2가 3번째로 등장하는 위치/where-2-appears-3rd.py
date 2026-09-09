N = int(input())
M_list = list(map(int,input().split()))
flag = 0
for i in range(len(M_list)):
    if M_list[i] == 2 :
        flag+=1

    if flag == 3:
        
        print(i+1)
        break
         
        