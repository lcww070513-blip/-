numbers = list(map(int, input().split()))
TEST_SCORES = { 100:0,90:0,80:0,70:0,60:0,50:0,40:0,30:0,20:0,10:0}
for i in numbers:
    if i == 0:
        break

    if i >= 10:
        score = (i // 10) * 10
        TEST_SCORES[score] += 1
for score, count in TEST_SCORES.items():
    print(f"{score} - {count}")
        
        
        
