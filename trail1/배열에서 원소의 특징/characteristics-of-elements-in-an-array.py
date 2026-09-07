# 10개의 원소를 입력받습니다.
arr = list(map(int, input().split()))

# 바로 앞 원소를 기억할 변수 (처음에는 없으므로 None 또는 문제 조건에 따른 기본값 설정)
prev = None

for i in arr:
    if i % 3 == 0:
        # 3의 배수를 처음 만났으므로, 지금까지 저장된 '바로 앞 원소'를 출력하고 종료합니다.
        print(prev)
        break
    
    # 3의 배수가 아니라면, 이 원소는 다음 원소의 '바로 앞 원소'가 될 후보입니다.
    prev = i
