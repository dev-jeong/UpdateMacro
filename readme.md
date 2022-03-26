1. NodeJS 설치
- https://nodejs.org/ko로 접속하여 LTS버전 다운로드

2. 설정값 입력
- env-sample의 파일명을 .env(맨 앞에 '.' 주의)로 변경한다
- .env내의 설정값들을 변경한다. 각각의 설정값들은 다음을 의미한다
    - BROWSER : 브라우저 보이기/가리기 옵션. 0이면 보이기, 1이면 가리기.
    - ID : (도매매 홈페이지에서 사용하는) 아이디
    - PW : 패스워드
    - INTERVAL : 작업과 작업간의 간격 (초 단위)

 3. 모듈 설치(최초 1회만 진행)
- install.bat 실행
- node_modules라는 폴더가 생성되면 정상적으로 설치된 것

 4. 프로그램 실행
- start.bat 실행