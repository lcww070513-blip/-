# 코드트리 풀이 기록

[코드트리](https://www.codetree.ai/)에서 푼 문제를 저장소 연동 기능으로 모아 둔 곳입니다.
문제 하나가 폴더 하나에 대응하며, 폴더 안에는 문제 정보를 담은 `README.md`와 제출한 풀이 코드가 들어 있습니다.

현재 134문제를 기록해 두었고, 풀이 언어는 py 125문제, rs 1문제입니다.
코드 읽기 유형은 답만 제출하므로 풀이 파일 없이 문제 정보만 남아 있습니다.

## 폴더 구조

```
├─ trail1/        Trail 1 커리큘럼 문제
├─ samsung-sw/    삼성 SW 역량 테스트 기출
└─ scripts/       루트 README 목록 생성 스크립트
```

새 문제가 추가된 뒤 `python3 scripts/build_readme.py`를 실행하면 아래 목록이 다시 만들어집니다.

## Trail 1 · Novice Low

총 133문제.

<details>
<summary><b>다중 반복문</b> (5문제)</summary>

| 문제 | 단원 | 난이도 | 풀이 |
|---|---|---|---|
| [별표 출력하기 2 `개념`](https://www.codetree.ai/trails/complete/curated-cards/intro-print-star-2) | 직각삼각형  별 출력 | 쉬움 | [print-star-2.py](trail1/%EB%B3%84%ED%91%9C%20%EC%B6%9C%EB%A0%A5%ED%95%98%EA%B8%B0%202/print-star-2.py) |
| [별표 출력하기 7 `챌린지`](https://www.codetree.ai/trails/complete/curated-cards/challenge-print-star-7) | 직각삼각형  별 출력 | 쉬움 | [print-star-7.py](trail1/%EB%B3%84%ED%91%9C%20%EC%B6%9C%EB%A0%A5%ED%95%98%EA%B8%B0%207/print-star-7.py) |
| [정사각형 두 개 출력 `테스트`](https://www.codetree.ai/trails/complete/curated-cards/test-output-two-rectangles) | 사각형 별 출력 | 쉬움 | [output-two-rectangles.py](trail1/%EC%A0%95%EC%82%AC%EA%B0%81%ED%98%95%20%EB%91%90%20%EA%B0%9C%20%EC%B6%9C%EB%A0%A5/output-two-rectangles.py) |
| [정사각형 별표 출력하기 `개념`](https://www.codetree.ai/trails/complete/curated-cards/intro-print-stars-in-square) | 사각형 별 출력 | 쉬움 | [print-stars-in-square.py](trail1/%EC%A0%95%EC%82%AC%EA%B0%81%ED%98%95%20%EB%B3%84%ED%91%9C%20%EC%B6%9C%EB%A0%A5%ED%95%98%EA%B8%B0/print-stars-in-square.py) |
| [직사각형 별표 출력하기 `챌린지`](https://www.codetree.ai/trails/complete/curated-cards/challenge-print-stars-in-rectangle) | 사각형 별 출력 | 쉬움 | [print-stars-in-rectangle.py](trail1/%EC%A7%81%EC%82%AC%EA%B0%81%ED%98%95%20%EB%B3%84%ED%91%9C%20%EC%B6%9C%EB%A0%A5%ED%95%98%EA%B8%B0/print-stars-in-rectangle.py) |

</details>

<details>
<summary><b>단순 반복문</b> (10문제)</summary>

| 문제 | 단원 | 난이도 | 풀이 |
|---|---|---|---|
| [1부터 n까지 출력 `테스트`](https://www.codetree.ai/trails/complete/curated-cards/test-print-from-1-to-n) | for문 a → b 1씩 증가 | 쉬움 | [print-from-1-to-n.py](trail1/1%EB%B6%80%ED%84%B0%20n%EA%B9%8C%EC%A7%80%20%EC%B6%9C%EB%A0%A5/print-from-1-to-n.py) |
| [감소시키며 출력하기 `개념`](https://www.codetree.ai/trails/complete/curated-cards/intro-decrease-and-print) | for문 b → a 1씩 감소 | 쉬움 | [decrease-and-print.py](trail1/%EA%B0%90%EC%86%8C%EC%8B%9C%ED%82%A4%EB%A9%B0%20%EC%B6%9C%EB%A0%A5%ED%95%98%EA%B8%B0/decrease-and-print.py) |
| [입력받는 수 부터 100까지 출력 `챌린지`](https://www.codetree.ai/trails/complete/curated-cards/challenge-print-number-from-given-num-to-100) | for문 a → b 1씩 증가 | 쉬움 | [print-number-from-given-num-to-100.py](trail1/%EC%9E%85%EB%A0%A5%EB%B0%9B%EB%8A%94%20%EC%88%98%20%EB%B6%80%ED%84%B0%20100%EA%B9%8C%EC%A7%80%20%EC%B6%9C%EB%A0%A5/print-number-from-given-num-to-100.py) |
| [정수 입력받아 배수 출력 `챌린지`](https://www.codetree.ai/trails/complete/curated-cards/challenge-print-multiple-of-input) | for문 a → b 2씩 증가 | 쉬움 | [print-multiple-of-input.py](trail1/%EC%A0%95%EC%88%98%20%EC%9E%85%EB%A0%A5%EB%B0%9B%EC%95%84%20%EB%B0%B0%EC%88%98%20%EC%B6%9C%EB%A0%A5/print-multiple-of-input.py) |
| [증가시키며 출력하기 `개념`](https://www.codetree.ai/trails/complete/curated-cards/intro-increase-and-print) | for문 a → b 2씩 증가 | 쉬움 | [increase-and-print.py](trail1/%EC%A6%9D%EA%B0%80%EC%8B%9C%ED%82%A4%EB%A9%B0%20%EC%B6%9C%EB%A0%A5%ED%95%98%EA%B8%B0/increase-and-print.py) |
| [차례로 출력 `개념`](https://www.codetree.ai/trails/complete/curated-cards/intro-print-in-order) | for문 a → b 1씩 증가 | 쉬움 | [print-in-order.py](trail1/%EC%B0%A8%EB%A1%80%EB%A1%9C%20%EC%B6%9C%EB%A0%A5/print-in-order.py) |
| [출력결과 1 `챌린지`](https://www.codetree.ai/trails/complete/curated-cards/challenge-reading-k201517) | for문 a → b 1씩 증가 | 쉬움 | [문제만](trail1/%EC%B6%9C%EB%A0%A5%EA%B2%B0%EA%B3%BC%201) |
| [출력결과 10 `챌린지`](https://www.codetree.ai/trails/complete/curated-cards/challenge-reading-k201530) | for문 a → b 1씩 증가 | 쉬움 | [문제만](trail1/%EC%B6%9C%EB%A0%A5%EA%B2%B0%EA%B3%BC%2010) |
| [출력결과 8 `챌린지`](https://www.codetree.ai/trails/complete/curated-cards/challenge-reading-k201528) | for문 a → b 1씩 증가 | 쉬움 | [문제만](trail1/%EC%B6%9C%EB%A0%A5%EA%B2%B0%EA%B3%BC%208) |
| [홀수만 출력 `테스트`](https://www.codetree.ai/trails/complete/curated-cards/test-output-only-odd) | for문 a → b 2씩 증가 | 쉬움 | [output-only-odd.py](trail1/%ED%99%80%EC%88%98%EB%A7%8C%20%EC%B6%9C%EB%A0%A5/output-only-odd.py) |

</details>

<details>
<summary><b>연산자</b> (13문제)</summary>

| 문제 | 단원 | 난이도 | 풀이 |
|---|---|---|---|
| [2개의 정수를 서로 더하기 `챌린지`](https://www.codetree.ai/trails/complete/curated-cards/challenge-add-two-integers-each-other) | 사칙연산 | 쉬움 | [add-two-integers-each-other.py](trail1/2%EA%B0%9C%EC%9D%98%20%EC%A0%95%EC%88%98%EB%A5%BC%20%EC%84%9C%EB%A1%9C%20%EB%8D%94%ED%95%98%EA%B8%B0/add-two-integers-each-other.py) |
| [간단한 사칙연산 `개념`](https://www.codetree.ai/trails/complete/curated-cards/intro-simple-arithmetic-operation) | 사칙연산 | 쉬움 | [simple-arithmetic-operation.py](trail1/%EA%B0%84%EB%8B%A8%ED%95%9C%20%EC%82%AC%EC%B9%99%EC%97%B0%EC%82%B0/simple-arithmetic-operation.py) |
| [길이 변형 후 사각형 넓이 구하기 `개념`](https://www.codetree.ai/trails/complete/curated-cards/intro-square-width-after-length-change) | 사칙연산 | 쉬움 | [square-width-after-length-change.py](trail1/%EA%B8%B8%EC%9D%B4%20%EB%B3%80%ED%98%95%20%ED%9B%84%20%EC%82%AC%EA%B0%81%ED%98%95%20%EB%84%93%EC%9D%B4%20%EA%B5%AC%ED%95%98%EA%B8%B0/square-width-after-length-change.py) |
| [두수의 곱과 몫 `챌린지`](https://www.codetree.ai/trails/complete/curated-cards/challenge-multiple-and-quotient-of-two-numbers) | 사칙연산 | 쉬움 | [multiple-and-quotient-of-two-numbers.py](trail1/%EB%91%90%EC%88%98%EC%9D%98%20%EA%B3%B1%EA%B3%BC%20%EB%AA%AB/multiple-and-quotient-of-two-numbers.py) |
| [몫과 나머지 `챌린지`](https://www.codetree.ai/trails/complete/curated-cards/challenge-quotient-remainder) | 사칙연산 | 쉬움 | [quotient-remainder.py](trail1/%EB%AA%AB%EA%B3%BC%20%EB%82%98%EB%A8%B8%EC%A7%80/quotient-remainder.py) |
| [세 수의 합과 평균 구하기 `챌린지`](https://www.codetree.ai/trails/complete/curated-cards/challenge-sum-and-mean-of-three-numbers) | 합과 평균 | 쉬움 | [sum-and-mean-of-three-numbers.py](trail1/%EC%84%B8%20%EC%88%98%EC%9D%98%20%ED%95%A9%EA%B3%BC%20%ED%8F%89%EA%B7%A0%20%EA%B5%AC%ED%95%98%EA%B8%B0/sum-and-mean-of-three-numbers.py) |
| [입력받아 연산하기 `챌린지`](https://www.codetree.ai/trails/complete/curated-cards/challenge-take-input-and-operate) | 사칙연산 | 쉬움 | [take-input-and-operate.py](trail1/%EC%9E%85%EB%A0%A5%EB%B0%9B%EC%95%84%20%EC%97%B0%EC%82%B0%ED%95%98%EA%B8%B0/take-input-and-operate.py) |
| [출력결과 24 `챌린지`](https://www.codetree.ai/trails/complete/curated-cards/challenge-reading-k201622) | 사칙연산 | 쉬움 | [문제만](trail1/%EC%B6%9C%EB%A0%A5%EA%B2%B0%EA%B3%BC%2024) |
| [출력결과 25 `챌린지`](https://www.codetree.ai/trails/complete/curated-cards/challenge-reading-k201626) | 사칙연산 | 쉬움 | [문제만](trail1/%EC%B6%9C%EB%A0%A5%EA%B2%B0%EA%B3%BC%2025) |
| [출력결과 62 `챌린지`](https://www.codetree.ai/trails/complete/curated-cards/challenge-reading-k201815) | 사칙연산 | 쉬움 | [문제만](trail1/%EC%B6%9C%EB%A0%A5%EA%B2%B0%EA%B3%BC%2062) |
| [합과 차의 나눗셈 `테스트`](https://www.codetree.ai/trails/complete/curated-cards/test-divide-of-sum-and-sub) | 사칙연산 | 쉬움 | [divide-of-sum-and-sub.py](trail1/%ED%95%A9%EA%B3%BC%20%EC%B0%A8%EC%9D%98%20%EB%82%98%EB%88%97%EC%85%88/divide-of-sum-and-sub.py) |
| [합과 평균 `개념`](https://www.codetree.ai/trails/complete/curated-cards/intro-sum-and-avg) | 합과 평균 | 쉬움 | [sum-and-avg.py](trail1/%ED%95%A9%EA%B3%BC%20%ED%8F%89%EA%B7%A0/sum-and-avg.py) |
| [합과 평균의 차 `테스트`](https://www.codetree.ai/trails/complete/curated-cards/test-sub-of-average-and-sum) | 합과 평균 | 쉬움 | [sub-of-average-and-sum.py](trail1/%ED%95%A9%EA%B3%BC%20%ED%8F%89%EA%B7%A0%EC%9D%98%20%EC%B0%A8/sub-of-average-and-sum.py) |

</details>

<details>
<summary><b>입출력</b> (25문제)</summary>

| 문제 | 단원 | 난이도 | 풀이 |
|---|---|---|---|
| [1시간 뒤 시간 출력 `개념`](https://www.codetree.ai/trails/complete/curated-cards/intro-print-one-hour-later) | 특정 문자를 사이에 두고 입력 | 쉬움 | [print-one-hour-later.py](trail1/1%EC%8B%9C%EA%B0%84%20%EB%92%A4%20%EC%8B%9C%EA%B0%84%20%EC%B6%9C%EB%A0%A5/print-one-hour-later.py) |
| [길이 단위 환산하기 `챌린지`](https://www.codetree.ai/trails/complete/curated-cards/challenge-convert-length-units) | 실수 입력 | 쉬움 | [convert-length-units.py](trail1/%EA%B8%B8%EC%9D%B4%20%EB%8B%A8%EC%9C%84%20%ED%99%98%EC%82%B0%ED%95%98%EA%B8%B0/convert-length-units.py) |
| [날짜 변경하여 출력 `챌린지`](https://www.codetree.ai/trails/complete/curated-cards/challenge-print-date-with-different-format) | 특정 문자를 사이에 두고 입력 | 쉬움 | [print-date-with-different-format.py](trail1/%EB%82%A0%EC%A7%9C%20%EB%B3%80%EA%B2%BD%ED%95%98%EC%97%AC%20%EC%B6%9C%EB%A0%A5/print-date-with-different-format.py) |
| [날짜 변경하여 출력 2 `개념`](https://www.codetree.ai/trails/complete/curated-cards/intro-print-date-with-different-format-2) | 특정 문자를 사이에 두고 입력 | 쉬움 | [print-date-with-different-format-2.py](trail1/%EB%82%A0%EC%A7%9C%20%EB%B3%80%EA%B2%BD%ED%95%98%EC%97%AC%20%EC%B6%9C%EB%A0%A5%202/print-date-with-different-format-2.py) |
| [문자 받아 출력 `개념`](https://www.codetree.ai/trails/complete/curated-cards/intro-enter-char-and-print) | 문자, 문자열 입력 | 쉬움 | [enter-char-and-print.py](trail1/%EB%AC%B8%EC%9E%90%20%EB%B0%9B%EC%95%84%20%EC%B6%9C%EB%A0%A5/enter-char-and-print.py) |
| [문자열 받아 출력 `개념`](https://www.codetree.ai/trails/complete/curated-cards/intro-enter-word-and-print) | 문자, 문자열 입력 | 쉬움 | [enter-word-and-print.py](trail1/%EB%AC%B8%EC%9E%90%EC%97%B4%20%EB%B0%9B%EC%95%84%20%EC%B6%9C%EB%A0%A5/enter-word-and-print.py) |
| [문자열 순서 바꾸기 `테스트`](https://www.codetree.ai/trails/complete/curated-cards/test-change-order-of-strings) | 문자, 문자열 입력 | 쉬움 | [change-order-of-strings.py](trail1/%EB%AC%B8%EC%9E%90%EC%97%B4%20%EC%88%9C%EC%84%9C%20%EB%B0%94%EA%BE%B8%EA%B8%B0/change-order-of-strings.py) |
| [세 실수의 반올림 `챌린지`](https://www.codetree.ai/trails/complete/curated-cards/challenge-rounding-of-three-actual-numbers) | 2개의 줄에 걸쳐 입력 | 쉬움 | [rounding-of-three-actual-numbers.py](trail1/%EC%84%B8%20%EC%8B%A4%EC%88%98%EC%9D%98%20%EB%B0%98%EC%98%AC%EB%A6%BC/rounding-of-three-actual-numbers.py) |
| [실수 받아 그대로 출력 `개념`](https://www.codetree.ai/trails/complete/curated-cards/intro-enter-real-value-and-print) | 실수 입력 | 쉬움 | [enter-real-value-and-print.py](trail1/%EC%8B%A4%EC%88%98%20%EB%B0%9B%EC%95%84%20%EA%B7%B8%EB%8C%80%EB%A1%9C%20%EC%B6%9C%EB%A0%A5/enter-real-value-and-print.py) |
| [실수 입력받아 계산 `챌린지`](https://www.codetree.ai/trails/complete/curated-cards/challenge-calculation-by-inputting-a-real-number) | 2개의 줄에 걸쳐 입력 | 쉬움 | [calculation-by-inputting-a-real-number.py](trail1/%EC%8B%A4%EC%88%98%20%EC%9E%85%EB%A0%A5%EB%B0%9B%EC%95%84%20%EA%B3%84%EC%82%B0/calculation-by-inputting-a-real-number.py) |
| [실수 입력받아 계산 2 `테스트`](https://www.codetree.ai/trails/complete/curated-cards/test-calculation-by-inputting-a-real-number-2) | 실수 입력 | 쉬움 | [calculation-by-inputting-a-real-number-2.py](trail1/%EC%8B%A4%EC%88%98%20%EC%9E%85%EB%A0%A5%EB%B0%9B%EC%95%84%20%EA%B3%84%EC%82%B0%202/calculation-by-inputting-a-real-number-2.py) |
| [실수와 문자 받아 출력하기 `챌린지`](https://www.codetree.ai/trails/complete/curated-cards/challenge-print-number--and-letter) | 문자, 문자열 입력 | 쉬움 | [print-number--and-letter.py](trail1/%EC%8B%A4%EC%88%98%EC%99%80%20%EB%AC%B8%EC%9E%90%20%EB%B0%9B%EC%95%84%20%EC%B6%9C%EB%A0%A5%ED%95%98%EA%B8%B0/print-number--and-letter.py) |
| [입력받아 계산 `개념`](https://www.codetree.ai/trails/complete/curated-cards/intro-input-calculate) | 정수 입력 | 쉬움 | [input-calculate.py](trail1/%EC%9E%85%EB%A0%A5%EB%B0%9B%EC%95%84%20%EA%B3%84%EC%82%B0/input-calculate.py) |
| [입력받아 계산 2 `개념`](https://www.codetree.ai/trails/complete/curated-cards/intro-input-calculate-2) | 공백을 사이에 두고 입력 | 쉬움 | [input-calculate-2.py](trail1/%EC%9E%85%EB%A0%A5%EB%B0%9B%EC%95%84%20%EA%B3%84%EC%82%B0%202/input-calculate-2.py) |
| [입력받아 계산 3 `개념`](https://www.codetree.ai/trails/complete/curated-cards/intro-input-calculate-3) | 2개의 줄에 걸쳐 입력 | 쉬움 | [input-calculate-3.py](trail1/%EC%9E%85%EB%A0%A5%EB%B0%9B%EC%95%84%20%EA%B3%84%EC%82%B0%203/input-calculate-3.py) |
| [입력받아 계산 4 `챌린지`](https://www.codetree.ai/trails/complete/curated-cards/challenge-input-calculate-4) | 정수 입력 | 쉬움 | [input-calculate-4.py](trail1/%EC%9E%85%EB%A0%A5%EB%B0%9B%EC%95%84%20%EA%B3%84%EC%82%B0%204/input-calculate-4.py) |
| [입력받아 계산 5 `챌린지`](https://www.codetree.ai/trails/complete/curated-cards/challenge-input-calculate-5) | 공백을 사이에 두고 입력 | 쉬움 | [input-calculate-5.py](trail1/%EC%9E%85%EB%A0%A5%EB%B0%9B%EC%95%84%20%EA%B3%84%EC%82%B0%205/input-calculate-5.py) |
| [입력받아 출력 `챌린지`](https://www.codetree.ai/trails/complete/curated-cards/challenge-input-and-output) | 2개의 줄에 걸쳐 입력 | 쉬움 | [input-and-output.py](trail1/%EC%9E%85%EB%A0%A5%EB%B0%9B%EC%95%84%20%EC%B6%9C%EB%A0%A5/input-and-output.py) |
| [입력받아 출력 2 `챌린지`](https://www.codetree.ai/trails/complete/curated-cards/challenge-input-and-output-2) | 특정 문자를 사이에 두고 입력 | 쉬움 | [input-and-output-2.py](trail1/%EC%9E%85%EB%A0%A5%EB%B0%9B%EC%95%84%20%EC%B6%9C%EB%A0%A5%202/input-and-output-2.py) |
| [입력받은 값 교체하기 `챌린지`](https://www.codetree.ai/trails/complete/curated-cards/challenge-changing-inputs) | 공백을 사이에 두고 입력 | 쉬움 | [changing-inputs.py](trail1/%EC%9E%85%EB%A0%A5%EB%B0%9B%EC%9D%80%20%EA%B0%92%20%EA%B5%90%EC%B2%B4%ED%95%98%EA%B8%B0/changing-inputs.py) |
| [입력받은 값과 합 출력 `테스트`](https://www.codetree.ai/trails/complete/curated-cards/test-output-of-value-and-sum) | 공백을 사이에 두고 입력 | 쉬움 | [output-of-value-and-sum.py](trail1/%EC%9E%85%EB%A0%A5%EB%B0%9B%EC%9D%80%20%EA%B0%92%EA%B3%BC%20%ED%95%A9%20%EC%B6%9C%EB%A0%A5/output-of-value-and-sum.py) |
| [전화번호 바꾸기 `테스트`](https://www.codetree.ai/trails/complete/curated-cards/test-change-phone-number) | 특정 문자를 사이에 두고 입력 | 쉬움 | [change-phone-number.py](trail1/%EC%A0%84%ED%99%94%EB%B2%88%ED%98%B8%20%EB%B0%94%EA%BE%B8%EA%B8%B0/change-phone-number.py) |
| [점수 입출력 `챌린지`](https://www.codetree.ai/trails/complete/curated-cards/challenge-enter-int-and-print-score) | 정수 입력 | 쉬움 | [enter-int-and-print-score.py](trail1/%EC%A0%90%EC%88%98%20%EC%9E%85%EC%B6%9C%EB%A0%A5/enter-int-and-print-score.py) |
| [정수 세 개 입력받아 출력 `테스트`](https://www.codetree.ai/trails/complete/curated-cards/test-take-three-integers-and-output) | 2개의 줄에 걸쳐 입력 | 쉬움 | [take-three-integers-and-output.py](trail1/%EC%A0%95%EC%88%98%20%EC%84%B8%20%EA%B0%9C%20%EC%9E%85%EB%A0%A5%EB%B0%9B%EC%95%84%20%EC%B6%9C%EB%A0%A5/take-three-integers-and-output.py) |
| [정수 입력받아 계산 `테스트`](https://www.codetree.ai/trails/complete/curated-cards/test-calculation-by-inputting-an-integer) | 정수 입력 | 쉬움 | [calculation-by-inputting-an-integer.py](trail1/%EC%A0%95%EC%88%98%20%EC%9E%85%EB%A0%A5%EB%B0%9B%EC%95%84%20%EA%B3%84%EC%82%B0/calculation-by-inputting-an-integer.py) |

</details>

<details>
<summary><b>조건문</b> (47문제)</summary>

| 문제 | 단원 | 난이도 | 풀이 |
|---|---|---|---|
| [2개 중 최대 `개념`](https://www.codetree.ai/trails/complete/curated-cards/intro-max-of-two-nums) | 삼항 연산자 | 쉬움 | [max-of-two-nums.py](trail1/2%EA%B0%9C%20%EC%A4%91%20%EC%B5%9C%EB%8C%80/max-of-two-nums.py) |
| [3 또는 5의 배수 `테스트`](https://www.codetree.ai/trails/complete/curated-cards/test-multiples-of-3-or-5) | if else if else 조건문 | 쉬움 | [multiples-of-3-or-5.py](trail1/3%20%EB%98%90%EB%8A%94%205%EC%9D%98%20%EB%B0%B0%EC%88%98/multiples-of-3-or-5.py) |
| [4가지 관계연산자 `챌린지`](https://www.codetree.ai/trails/complete/curated-cards/challenge-four-relational-operators) | 비교 연산자와 조건문 | 쉬움 | [four-relational-operators.py](trail1/4%EA%B0%80%EC%A7%80%20%EA%B4%80%EA%B3%84%EC%97%B0%EC%82%B0%EC%9E%90/four-relational-operators.py) |
| [4번의 크기 비교 `테스트`](https://www.codetree.ai/trails/complete/curated-cards/test-4-time-comparison) | 비교 연산자와 조건문 | 쉬움 | [4-time-comparison.py](trail1/4%EB%B2%88%EC%9D%98%20%ED%81%AC%EA%B8%B0%20%EB%B9%84%EA%B5%90/4-time-comparison.py) |
| [굉장한 수 `개념`](https://www.codetree.ai/trails/complete/curated-cards/intro-amazing-number) | and, or 혼합 | 쉬움 | [amazing-number.py](trail1/%EA%B5%89%EC%9E%A5%ED%95%9C%20%EC%88%98/amazing-number.py) |
| [남녀노소 구분짓기 `개념`](https://www.codetree.ai/trails/complete/curated-cards/intro-sex-and-age) | 중첩 조건문 | 쉬움 | [sex-and-age.py](trail1/%EB%82%A8%EB%85%80%EB%85%B8%EC%86%8C%20%EA%B5%AC%EB%B6%84%EC%A7%93%EA%B8%B0/sex-and-age.py) |
| [두 번의 연산 `테스트`](https://www.codetree.ai/trails/complete/curated-cards/test-two-operations) | if if 조건문 | 쉬움 | [two-operations.py](trail1/%EB%91%90%20%EB%B2%88%EC%9D%98%20%EC%97%B0%EC%82%B0/two-operations.py) |
| [두 사람 `테스트`](https://www.codetree.ai/trails/complete/curated-cards/test-two-person) | and, or 혼합 | 쉬움 | [two-person.py](trail1/%EB%91%90%20%EC%82%AC%EB%9E%8C/two-person.py) |
| [두 수의 짝홀 여부 `개념`](https://www.codetree.ai/trails/complete/curated-cards/intro-parity-of-two-numbers) | if else if else 조건문 | 쉬움 | [parity-of-two-numbers.py](trail1/%EB%91%90%20%EC%88%98%EC%9D%98%20%EC%A7%9D%ED%99%80%20%EC%97%AC%EB%B6%80/parity-of-two-numbers.py) |
| [둘 중 하나의 배수 `테스트`](https://www.codetree.ai/trails/complete/curated-cards/test-multiple-of-either) | or 연산자 | 쉬움 | [multiple-of-either.py](trail1/%EB%91%98%20%EC%A4%91%20%ED%95%98%EB%82%98%EC%9D%98%20%EB%B0%B0%EC%88%98/multiple-of-either.py) |
| [등급 매기기 `챌린지`](https://www.codetree.ai/trails/complete/curated-cards/challenge-ranking) | if elif elif else 조건문 | 쉬움 | [ranking.py](trail1/%EB%93%B1%EA%B8%89%20%EB%A7%A4%EA%B8%B0%EA%B8%B0/ranking.py) |
| [물의 상태 `개념`](https://www.codetree.ai/trails/complete/curated-cards/intro-state-of-water) | if elif else 조건문 | 쉬움 | [state-of-water.py](trail1/%EB%AC%BC%EC%9D%98%20%EC%83%81%ED%83%9C/state-of-water.py) |
| [범위 밖의 수 `개념`](https://www.codetree.ai/trails/complete/curated-cards/intro-number-out-of-range) | or 연산자 | 쉬움 | [number-out-of-range.py](trail1/%EB%B2%94%EC%9C%84%20%EB%B0%96%EC%9D%98%20%EC%88%98/number-out-of-range.py) |
| [범위 안의 수 `개념`](https://www.codetree.ai/trails/complete/curated-cards/intro-number-in-range) | and 연산자 | 쉬움 | [number-in-range.py](trail1/%EB%B2%94%EC%9C%84%20%EC%95%88%EC%9D%98%20%EC%88%98/number-in-range.py) |
| [비교 연산 `개념`](https://www.codetree.ai/trails/complete/curated-cards/intro-comparison-operator) | 비교 연산자와 조건문 | 쉬움 | [comparison-operator.py](trail1/%EB%B9%84%EA%B5%90%20%EC%97%B0%EC%82%B0/comparison-operator.py) |
| [비교에 따른 연산 `테스트`](https://www.codetree.ai/trails/complete/curated-cards/test-operation-based-on-comparison) | if else 조건문 | 쉬움 | [operation-based-on-comparison.py](trail1/%EB%B9%84%EA%B5%90%EC%97%90%20%EB%94%B0%EB%A5%B8%20%EC%97%B0%EC%82%B0/operation-based-on-comparison.py) |
| [살 수 있는 물건 `테스트`](https://www.codetree.ai/trails/complete/curated-cards/test-things-able-to-buy) | if elif else 조건문 | 쉬움 | [things-able-to-buy.py](trail1/%EC%82%B4%20%EC%88%98%20%EC%9E%88%EB%8A%94%20%EB%AC%BC%EA%B1%B4/things-able-to-buy.py) |
| [살 수 있는 물건 2 `테스트`](https://www.codetree.ai/trails/complete/curated-cards/test-things-able-to-buy-2) | if elif elif else 조건문 | 쉬움 | [things-able-to-buy-2.py](trail1/%EC%82%B4%20%EC%88%98%20%EC%9E%88%EB%8A%94%20%EB%AC%BC%EA%B1%B4%202/things-able-to-buy-2.py) |
| [삼항연산자 `챌린지`](https://www.codetree.ai/trails/complete/curated-cards/challenge-ternary-operator) | 삼항 연산자 | 쉬움 | [ternary-operator.py](trail1/%EC%82%BC%ED%95%AD%EC%97%B0%EC%82%B0%EC%9E%90/ternary-operator.py) |
| [삼항연산자 2 `테스트`](https://www.codetree.ai/trails/complete/curated-cards/test-ternary-operator-2) | 삼항 연산자 | 쉬움 | [ternary-operator-2.py](trail1/%EC%82%BC%ED%95%AD%EC%97%B0%EC%82%B0%EC%9E%90%202/ternary-operator-2.py) |
| [세 수의 중간값 `테스트`](https://www.codetree.ai/trails/complete/curated-cards/test-median-of-three-numbers) | and 연산자 | 쉬움 | [median-of-three-numbers.py](trail1/%EC%84%B8%20%EC%88%98%EC%9D%98%20%EC%A4%91%EA%B0%84%EA%B0%92/median-of-three-numbers.py) |
| [세 정수의 최솟값 `챌린지`](https://www.codetree.ai/trails/complete/curated-cards/challenge-minimum-of-three-numbers) | and 연산자 | 어려움 | [minimum-of-three-numbers.py](trail1/%EC%84%B8%20%EC%A0%95%EC%88%98%EC%9D%98%20%EC%B5%9C%EC%86%9F%EA%B0%92/minimum-of-three-numbers.py) |
| [수의 계절은 `개념`](https://www.codetree.ai/trails/complete/curated-cards/intro-season-of-num) | and, or 혼합 | 쉬움 | [season-of-num.py](trail1/%EC%88%98%EC%9D%98%20%EA%B3%84%EC%A0%88%EC%9D%80/season-of-num.py) |
| [시력 검사 `챌린지`](https://www.codetree.ai/trails/complete/curated-cards/challenge-eye-test) | and 연산자 | 쉬움 | [eye-test.py](trail1/%EC%8B%9C%EB%A0%A5%20%EA%B2%80%EC%82%AC/eye-test.py) |
| [시력 검사 2 `챌린지`](https://www.codetree.ai/trails/complete/curated-cards/challenge-eye-test-2) | if elif else 조건문 | 쉬움 | [eye-test-2.py](trail1/%EC%8B%9C%EB%A0%A5%20%EA%B2%80%EC%82%AC%202/eye-test-2.py) |
| [시험 통과 여부 확인하기 `개념`](https://www.codetree.ai/trails/complete/curated-cards/intro-verify-test-passed) | if else 조건문 | 쉬움 | [verify-test-passed.py](trail1/%EC%8B%9C%ED%97%98%20%ED%86%B5%EA%B3%BC%20%EC%97%AC%EB%B6%80%20%ED%99%95%EC%9D%B8%ED%95%98%EA%B8%B0/verify-test-passed.py) |
| [알파벳에 따른 평가 `챌린지`](https://www.codetree.ai/trails/complete/curated-cards/challenge-evaluation-by-alphabet) | if elif elif else 조건문 | 쉬움 | [evaluation-by-alphabet.py](trail1/%EC%95%8C%ED%8C%8C%EB%B2%B3%EC%97%90%20%EB%94%B0%EB%A5%B8%20%ED%8F%89%EA%B0%80/evaluation-by-alphabet.py) |
| [윤년인가 `개념`](https://www.codetree.ai/trails/complete/curated-cards/intro-is-leap-year) | 중첩 조건문 | 쉬움 | [is-leap-year.py](trail1/%EC%9C%A4%EB%85%84%EC%9D%B8%EA%B0%80/is-leap-year.py) |
| [음수 구별하기 `개념`](https://www.codetree.ai/trails/complete/curated-cards/intro-separate-negative-number) | if 조건문 | 쉬움 | [separate-negative-number.py](trail1/%EC%9D%8C%EC%88%98%20%EA%B5%AC%EB%B3%84%ED%95%98%EA%B8%B0/separate-negative-number.py) |
| [일 수 구하기 `챌린지`](https://www.codetree.ai/trails/complete/curated-cards/challenge-number-of-days-in-month) | 중첩 조건문 | 보통 | [number-of-days-in-month.py](trail1/%EC%9D%BC%20%EC%88%98%20%EA%B5%AC%ED%95%98%EA%B8%B0/number-of-days-in-month.py) |
| [장학금 `챌린지`](https://www.codetree.ai/trails/complete/curated-cards/challenge-scholarship) | and, or 혼합 | 쉬움 | [scholarship.py](trail1/%EC%9E%A5%ED%95%99%EA%B8%88/scholarship.py) |
| [점수 비교 `개념`](https://www.codetree.ai/trails/complete/curated-cards/intro-score-comparison) | and 연산자 | 쉬움 | [score-comparison.py](trail1/%EC%A0%90%EC%88%98%20%EB%B9%84%EA%B5%90/score-comparison.py) |
| [정사각형의 넓이 `테스트`](https://www.codetree.ai/trails/complete/curated-cards/test-area-of-a-rectangle) | if 조건문 | 쉬움 | [area-of-a-rectangle.py](trail1/%EC%A0%95%EC%82%AC%EA%B0%81%ED%98%95%EC%9D%98%20%EB%84%93%EC%9D%B4/area-of-a-rectangle.py) |
| [정수의 조건 여부 `챌린지`](https://www.codetree.ai/trails/complete/curated-cards/challenge-numbers-condition) | if else 조건문 | 쉬움 | [numbers-condition.py](trail1/%EC%A0%95%EC%88%98%EC%9D%98%20%EC%A1%B0%EA%B1%B4%20%EC%97%AC%EB%B6%80/numbers-condition.py) |
| [정수의 조건 여부 2 `챌린지`](https://www.codetree.ai/trails/complete/curated-cards/challenge-numbers-condition-2) | if if 조건문 | 쉬움 | [numbers-condition-2.py](trail1/%EC%A0%95%EC%88%98%EC%9D%98%20%EC%A1%B0%EA%B1%B4%20%EC%97%AC%EB%B6%80%202/numbers-condition-2.py) |
| [정수의 조건 여부 3 `챌린지`](https://www.codetree.ai/trails/complete/curated-cards/challenge-numbers-condition-3) | or 연산자 | 쉬움 | [numbers-condition-3.py](trail1/%EC%A0%95%EC%88%98%EC%9D%98%20%EC%A1%B0%EA%B1%B4%20%EC%97%AC%EB%B6%80%203/numbers-condition-3.py) |
| [좀 더 어려운 수학 점수 `챌린지`](https://www.codetree.ai/trails/complete/curated-cards/challenge-math-scores-are-more-difficult) | and, or 혼합 | 보통 | [math-scores-are-more-difficult.py](trail1/%EC%A2%80%20%EB%8D%94%20%EC%96%B4%EB%A0%A4%EC%9A%B4%20%EC%88%98%ED%95%99%20%EC%A0%90%EC%88%98/math-scores-are-more-difficult.py) |
| [중앙값 구하기 `테스트`](https://www.codetree.ai/trails/complete/curated-cards/test-find-the-median) | 중첩 조건문 | 쉬움 | [find-the-median.py](trail1/%EC%A4%91%EC%95%99%EA%B0%92%20%EA%B5%AC%ED%95%98%EA%B8%B0/find-the-median.py) |
| [체질량지수 `챌린지`](https://www.codetree.ai/trails/complete/curated-cards/challenge-bmi) | if 조건문 | 보통 | [bmi.py](trail1/%EC%B2%B4%EC%A7%88%EB%9F%89%EC%A7%80%EC%88%98/bmi.py) |
| [최대 2번의 연산 `개념`](https://www.codetree.ai/trails/complete/curated-cards/intro-up-to-2-calculations) | if if 조건문 | 쉬움 | [up-to-2-calculations.py](trail1/%EC%B5%9C%EB%8C%80%202%EB%B2%88%EC%9D%98%20%EC%97%B0%EC%82%B0/up-to-2-calculations.py) |
| [최댓값 구하기 `챌린지`](https://www.codetree.ai/trails/complete/curated-cards/challenge-maximum-value) | 중첩 조건문 | 어려움 | [maximum-value.py](trail1/%EC%B5%9C%EB%8C%93%EA%B0%92%20%EA%B5%AC%ED%95%98%EA%B8%B0/maximum-value.py) |
| [출력결과 61 `챌린지`](https://www.codetree.ai/trails/complete/curated-cards/challenge-reading-k201814) | 중첩 조건문 | 쉬움 | [문제만](trail1/%EC%B6%9C%EB%A0%A5%EA%B2%B0%EA%B3%BC%2061) |
| [출석 부르기 `개념`](https://www.codetree.ai/trails/complete/curated-cards/intro-calling-attendance) | if elif elif else 조건문 | 쉬움 | [calling-attendance.py](trail1/%EC%B6%9C%EC%84%9D%20%EB%B6%80%EB%A5%B4%EA%B8%B0/calling-attendance.py) |
| [코로나 매뉴얼 `챌린지`](https://www.codetree.ai/trails/complete/curated-cards/challenge-covid-manual) | 중첩 조건문 | 어려움 | [covid-manual.py](trail1/%EC%BD%94%EB%A1%9C%EB%82%98%20%EB%A7%A4%EB%89%B4%EC%96%BC/covid-manual.py) |
| [큰 수에서 빼기 `챌린지`](https://www.codetree.ai/trails/complete/curated-cards/challenge-subtract-from-large-number) | if 조건문 | 쉬움 | [subtract-from-large-number.py](trail1/%ED%81%B0%20%EC%88%98%EC%97%90%EC%84%9C%20%EB%B9%BC%EA%B8%B0/subtract-from-large-number.py) |
| [특정 조건 두 정수 비교 `챌린지`](https://www.codetree.ai/trails/complete/curated-cards/challenge-specific-comparison-of-two-natural-numbers) | if else if else 조건문 | 쉬움 | [specific-comparison-of-two-natural-numbers.py](trail1/%ED%8A%B9%EC%A0%95%20%EC%A1%B0%EA%B1%B4%20%EB%91%90%20%EC%A0%95%EC%88%98%20%EB%B9%84%EA%B5%90/specific-comparison-of-two-natural-numbers.py) |
| [특정 조건 세 정수 비교 `챌린지`](https://www.codetree.ai/trails/complete/curated-cards/challenge-specific-comparison-of-three-natural-numbers) | and 연산자 | 보통 | [specific-comparison-of-three-natural-numbers.py](trail1/%ED%8A%B9%EC%A0%95%20%EC%A1%B0%EA%B1%B4%20%EC%84%B8%20%EC%A0%95%EC%88%98%20%EB%B9%84%EA%B5%90/specific-comparison-of-three-natural-numbers.py) |

</details>

<details>
<summary><b>출력</b> (33문제)</summary>

| 문제 | 단원 | 난이도 | 풀이 |
|---|---|---|---|
| [2줄 출력 `개념`](https://www.codetree.ai/trails/complete/curated-cards/intro-print-two-lines) | 기본 출력 | 쉬움 | [print-two-lines.py](trail1/2%EC%A4%84%20%EC%B6%9C%EB%A0%A5/print-two-lines.py) |
| [길이 단위 변환하기 `챌린지`](https://www.codetree.ai/trails/complete/curated-cards/challenge-change-length-unit) | 소수점 맞춰 출력 | 쉬움 | [change-length-unit.py](trail1/%EA%B8%B8%EC%9D%B4%20%EB%8B%A8%EC%9C%84%20%EB%B3%80%ED%99%98%ED%95%98%EA%B8%B0/change-length-unit.py) |
| [다양하게 출력 `테스트`](https://www.codetree.ai/trails/complete/curated-cards/test-print-in-variety) | 기본 출력 | 쉬움 | [print-in-variety.py](trail1/%EB%8B%A4%EC%96%91%ED%95%98%EA%B2%8C%20%EC%B6%9C%EB%A0%A5/print-in-variety.py) |
| [단어 출력 `개념`](https://www.codetree.ai/trails/complete/curated-cards/intro-print-word) | 기본 출력 | 쉬움 | [print-word.py](trail1/%EB%8B%A8%EC%96%B4%20%EC%B6%9C%EB%A0%A5/print-word.py) |
| [달에서 무게 구하기 `개념`](https://www.codetree.ai/trails/complete/curated-cards/intro-weight-on-the-moon) | 소수점 맞춰 출력 | 쉬움 | [weight-on-the-moon.py](trail1/%EB%8B%AC%EC%97%90%EC%84%9C%20%EB%AC%B4%EA%B2%8C%20%EA%B5%AC%ED%95%98%EA%B8%B0/weight-on-the-moon.py) |
| [데이터 교환 `테스트`](https://www.codetree.ai/trails/complete/curated-cards/test-exchange-data) | 두 변수 값을 교환 | 쉬움 | [exchange-data.py](trail1/%EB%8D%B0%EC%9D%B4%ED%84%B0%20%EA%B5%90%ED%99%98/exchange-data.py) |
| [두 실수의 곱 `테스트`](https://www.codetree.ai/trails/complete/curated-cards/test-the-product-of-two-real-numbers) | 소수점 맞춰 출력 | 쉬움 | [the-product-of-two-real-numbers.py](trail1/%EB%91%90%20%EC%8B%A4%EC%88%98%EC%9D%98%20%EA%B3%B1/the-product-of-two-real-numbers.py) |
| [두줄 출력 `챌린지`](https://www.codetree.ai/trails/complete/curated-cards/challenge-print-two-sentences-introduce) | 기본 출력 | 쉬움 | [print-two-sentences-introduce.py](trail1/%EB%91%90%EC%A4%84%20%EC%B6%9C%EB%A0%A5/print-two-sentences-introduce.py) |
| [따옴표 출력 `개념`](https://www.codetree.ai/trails/complete/curated-cards/intro-print-quote) | 기본 출력 | 쉬움 | [print-quote.py](trail1/%EB%94%B0%EC%98%B4%ED%91%9C%20%EC%B6%9C%EB%A0%A5/print-quote.py) |
| [문자 변경하기 `테스트`](https://www.codetree.ai/trails/complete/curated-cards/test-change-charater) | 변수 값 변경 | 쉬움 | [change-charater.py](trail1/%EB%AC%B8%EC%9E%90%20%EB%B3%80%EA%B2%BD%ED%95%98%EA%B8%B0/change-charater.py) |
| [문장 출력 `개념`](https://www.codetree.ai/trails/complete/curated-cards/intro-print-sentence) | 기본 출력 | 쉬움 | [print-sentence.py](trail1/%EB%AC%B8%EC%9E%A5%20%EC%B6%9C%EB%A0%A5/print-sentence.py) |
| [변수 값 교체하기 `개념`](https://www.codetree.ai/trails/complete/curated-cards/intro-replacing-variable-values) | 변수 값 변경 | 쉬움 | [replacing-variable-values.py](trail1/%EB%B3%80%EC%88%98%20%EA%B0%92%20%EA%B5%90%EC%B2%B4%ED%95%98%EA%B8%B0/replacing-variable-values.py) |
| [변수 값 교체하기 2 `개념`](https://www.codetree.ai/trails/complete/curated-cards/intro-replacing-variable-values-2) | 다른 변수로부터 값 변경 | 쉬움 | [replacing-variable-values-2.py](trail1/%EB%B3%80%EC%88%98%20%EA%B0%92%20%EA%B5%90%EC%B2%B4%ED%95%98%EA%B8%B0%202/replacing-variable-values-2.py) |
| [변수 값 교체하기 3 `개념`](https://www.codetree.ai/trails/complete/curated-cards/intro-replacing-variable-values-3) | 두 변수 값을 교환 | 쉬움 | [replacing-variable-values-3.py](trail1/%EB%B3%80%EC%88%98%20%EA%B0%92%20%EA%B5%90%EC%B2%B4%ED%95%98%EA%B8%B0%203/replacing-variable-values-3.py) |
| [변수 값 교체하기 4 `챌린지`](https://www.codetree.ai/trails/complete/curated-cards/challenge-replacing-variable-values-4) | 변수 값 변경 | 쉬움 | [replacing-variable-values-4.py](trail1/%EB%B3%80%EC%88%98%20%EA%B0%92%20%EA%B5%90%EC%B2%B4%ED%95%98%EA%B8%B0%204/replacing-variable-values-4.py) |
| [변수 값 교체하기 5 `챌린지`](https://www.codetree.ai/trails/complete/curated-cards/challenge-replacing-variable-values-5) | 다른 변수로부터 값 변경 | 쉬움 | [replacing-variable-values-5.py](trail1/%EB%B3%80%EC%88%98%20%EA%B0%92%20%EA%B5%90%EC%B2%B4%ED%95%98%EA%B8%B0%205/replacing-variable-values-5.py) |
| [변수 값 교체하기 6 `챌린지`](https://www.codetree.ai/trails/complete/curated-cards/challenge-replacing-variable-values-6) | 두 변수 값을 교환 | 쉬움 | [replacing-variable-values-6.py](trail1/%EB%B3%80%EC%88%98%20%EA%B0%92%20%EA%B5%90%EC%B2%B4%ED%95%98%EA%B8%B0%206/replacing-variable-values-6.py) |
| [변수 값 복사하기 `개념`](https://www.codetree.ai/trails/complete/curated-cards/intro-copying-variable-values) | 변수값 동시에 복사 | 쉬움 | [copying-variable-values.py](trail1/%EB%B3%80%EC%88%98%20%EA%B0%92%20%EB%B3%B5%EC%82%AC%ED%95%98%EA%B8%B0/copying-variable-values.py) |
| [변수 값 복사하기 2 `챌린지`](https://www.codetree.ai/trails/complete/curated-cards/challenge-copying-variable-values-2) | 변수값 동시에 복사 | 쉬움 | [copying-variable-values-2.py](trail1/%EB%B3%80%EC%88%98%20%EA%B0%92%20%EB%B3%B5%EC%82%AC%ED%95%98%EA%B8%B0%202/copying-variable-values-2.py) |
| [변수 선언하기 `챌린지`](https://www.codetree.ai/trails/complete/curated-cards/challenge-declaring-variables) | 변수와 자료형 | 쉬움 | [declaring-variables.py](trail1/%EB%B3%80%EC%88%98%20%EC%84%A0%EC%96%B8%ED%95%98%EA%B8%B0/declaring-variables.py) |
| [변수 출력하기 `챌린지`](https://www.codetree.ai/trails/complete/curated-cards/challenge-outputing-variables) | 출력 형식 | 쉬움 | [outputing-variables.py](trail1/%EB%B3%80%EC%88%98%20%EC%B6%9C%EB%A0%A5%ED%95%98%EA%B8%B0/outputing-variables.py) |
| [변수 출력하기 2 `챌린지`](https://www.codetree.ai/trails/complete/curated-cards/challenge-outputing-variables-2) | 출력 형식 | 쉬움 | [outputing-variables-2.py](trail1/%EB%B3%80%EC%88%98%20%EC%B6%9C%EB%A0%A5%ED%95%98%EA%B8%B0%202/outputing-variables-2.py) |
| [변수 출력하기 3 `테스트`](https://www.codetree.ai/trails/complete/curated-cards/test-outputing-variables-3) | 출력 형식 | 쉬움 | [outputing-variables-3.py](trail1/%EB%B3%80%EC%88%98%20%EC%B6%9C%EB%A0%A5%ED%95%98%EA%B8%B0%203/outputing-variables-3.py) |
| [세 정수형 변수 선언 `개념`](https://www.codetree.ai/trails/complete/curated-cards/intro-declaration-of-three-natural-numbers) | 출력 형식 | 쉬움 | [declaration-of-three-natural-numbers.py](trail1/%EC%84%B8%20%EC%A0%95%EC%88%98%ED%98%95%20%EB%B3%80%EC%88%98%20%EC%84%A0%EC%96%B8/declaration-of-three-natural-numbers.py) |
| [소수점 반올림하기 `챌린지`](https://www.codetree.ai/trails/complete/curated-cards/challenge-rounding-decimal-points) | 소수점 맞춰 출력 | 쉬움 | [rounding-decimal-points.py](trail1/%EC%86%8C%EC%88%98%EC%A0%90%20%EB%B0%98%EC%98%AC%EB%A6%BC%ED%95%98%EA%B8%B0/rounding-decimal-points.py) |
| [숫자 2개 출력 `개념`](https://www.codetree.ai/trails/complete/curated-cards/intro-print-two-numbers) | 기본 출력 | 쉬움 | [print-two-numbers.py](trail1/%EC%88%AB%EC%9E%90%202%EA%B0%9C%20%EC%B6%9C%EB%A0%A5/print-two-numbers.py) |
| [숫자 출력하기 `개념`](https://www.codetree.ai/trails/complete/curated-cards/intro-print-one-number) | 기본 출력 | 쉬움 | [print-one-number.py](trail1/%EC%88%AB%EC%9E%90%20%EC%B6%9C%EB%A0%A5%ED%95%98%EA%B8%B0/print-one-number.py) |
| [정수 복사 `테스트`](https://www.codetree.ai/trails/complete/curated-cards/test-copy-integer) | 다른 변수로부터 값 변경 | 쉬움 | [copy-integer.py](trail1/%EC%A0%95%EC%88%98%20%EB%B3%B5%EC%82%AC/copy-integer.py) |
| [정수 선언하고 곱 출력 `테스트`](https://www.codetree.ai/trails/complete/curated-cards/test-Declare-an-integer-and-print-the-multiplication) | 변수와 자료형 | 쉬움 | [Declare-an-integer-and-print-the-multiplication.py](trail1/%EC%A0%95%EC%88%98%20%EC%84%A0%EC%96%B8%ED%95%98%EA%B3%A0%20%EA%B3%B1%20%EC%B6%9C%EB%A0%A5/Declare-an-integer-and-print-the-multiplication.py) |
| [정수 선언하고 뺄셈 `개념`](https://www.codetree.ai/trails/complete/curated-cards/intro-define-numbers-and-substract) | 변수와 자료형 | 쉬움 | [define-numbers-and-substract.py](trail1/%EC%A0%95%EC%88%98%20%EC%84%A0%EC%96%B8%ED%95%98%EA%B3%A0%20%EB%BA%84%EC%85%88/define-numbers-and-substract.py) |
| [출력결과 42 `챌린지`](https://www.codetree.ai/trails/complete/curated-cards/challenge-reading-k201715) | 소수점 맞춰 출력 | 쉬움 | [문제만](trail1/%EC%B6%9C%EB%A0%A5%EA%B2%B0%EA%B3%BC%2042) |
| [한줄 출력 `챌린지`](https://www.codetree.ai/trails/complete/curated-cards/challenge-print-one-line) | 기본 출력 | 쉬움 | [print-one-line.py](trail1/%ED%95%9C%EC%A4%84%20%EC%B6%9C%EB%A0%A5/print-one-line.py) |
| [합을 복사하기 `테스트`](https://www.codetree.ai/trails/complete/curated-cards/test-copy-the-sum) | 변수값 동시에 복사 | 쉬움 | [copy-the-sum.py](trail1/%ED%95%A9%EC%9D%84%20%EB%B3%B5%EC%82%AC%ED%95%98%EA%B8%B0/copy-the-sum.py) |

</details>

## 삼성 SW 역량 테스트

총 1문제.

| 문제 | 유형 | 난이도 | 풀이 |
|---|---|---|---|
| [아기 고래의 첫 항해](https://www.codetree.ai/frequent-problems/samsung-sw/problems/baby-whale-first-voyage) | Simulation, BFS | 12 | [baby-whale-first-voyage.rs](samsung-sw/%EC%95%84%EA%B8%B0%20%EA%B3%A0%EB%9E%98%EC%9D%98%20%EC%B2%AB%20%ED%95%AD%ED%95%B4/baby-whale-first-voyage.rs) |
