import os                       # 운영 체제와 상호작용하기 위한 라이브러리
import requests                 # HTTP 요청을 보내기 위한 라이브러리
from dotenv import load_dotenv  # .env 파일을 읽기 위한 라이브러리


load_dotenv()  # .env 파일을 읽어 환경 변수로 설정합니다.

# 1. [ dotenv를 활용하여 카카오 API 키 가져오기 ]
kakao_api_key = os.getenv('MY_KAKAO_API_KEY')
# 2. [ 공식 문서를 참고하여 카카오 API 검색 URL 설정하기 ]
book_search_url = os.getenv('BOOK_SEARCH_URL')

# 3. 도서 데이터를 가져오는 함수 정의
def fetch_books(keyword):       # keyword: 검색할 키워드
    url = book_search_url     # 검색 API URL
    headers = {
        'Authorization': f'KakaoAK {kakao_api_key}',
    }
    params = {
        'query': keyword,
        'size': 10,           # 한 번에 가져올 도서 수 (최대 50)
    }
    # 3.1 [ requests 문서를 참고하여 HTTP GET 요청 보내는 코드 작성하기 ]
    response = requests.get(url, headers=headers, params=params)

    # 3.2 [ requests 문서를 참고하여 응답 데이터를  python의 dict 타입으로 변환하여 data 변수에 저장 ]
    data = response.json()

    return data


# '펭귄' 키워드를 사용하여 도서 검색 데이터를 가져옵니다.
result = fetch_books('펭귄')
# 결과에서 도서 목록을 가져옵니다.
books = result.get('documents', [])

# 4. [ 각 도서를 순회하며 넘버링과 제목을 출력하기 ]
# ex) 1. 펭귄이 살아갑니다.
#     2. 펭귄의 ...
for number, book in enumerate(books, start=1):
    print(f"{number}. {book['title']}")
