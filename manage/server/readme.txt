해당 부분은
mariaDB와 typeORM을 이용하여 연동하는 부분이다.
TYPEORM 사용을 위한 테이블 정의와, 각 쿼리문 요청을 entity아니면 dto로 정의하여 저장할 예정이다.
자세한 부분은
https://orkhan.gitbook.io/typeorm/docs/usage-with-javascript
참고

entity 망하면 src/data/ 에 있는 js파일에서 따로 저장하고, 여기서 저장 로직, 요청은 server.js로 보내도록 하겠다.