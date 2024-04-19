const express = require('express');
const bodyParser = require('body-parser');
const { createConnection } = require('typeorm');
const { Product } = require('./entity/Product'); // Product 엔티티 파일의 경로에 따라 수정

const app = express();
const port = 3000;

// JSON 파싱을 위한 미들웨어 추가
app.use(bodyParser.json());

// TypeORM 연결 설정
createConnection()
  .then(async (connection) => {
    console.log('데이터베이스 연결 성공');

    // 태그 목록 조회
    app.get('/products', async (req, res) => {
      try {
        const products = await connection.getRepository(Product).find();
        res.json(products);
        console.log('데이터 반환 성공');
      } catch (error) {
        console.error('상품 목록 조회 중 오류 발생:', error);
        res.status(500).send('상품 목록 조회 중 오류가 발생했습니다.');
      }
    });

    // 서버 실행
    app.listen(port, () => {
      console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
    });
  })
  .catch((error) => {
    console.error('데이터베이스 연결 오류:', error);
  });
