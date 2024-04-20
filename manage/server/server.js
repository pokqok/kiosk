const express = require('express');
const bodyParser = require('body-parser');
const mariadb = require('mariadb');
const app = express();
const port = 3000;
const cors = require('cors'); 
//const config = require('./DBconfig.json');

// JSON 파싱을 위한 미들웨어 추가
app.use(bodyParser.json());

/*
const dbConfig = mariadb.createPool({
  host: config.db.host,
  user: config.db.user,
  password: config.db.password,
  database: config.db.database,
});
*/


// JSON 파싱을 위한 미들웨어 추가
app.use(bodyParser.json());
app.use(cors());

// 카테고리 관련 라우터 추가
//app.use(categoryRouter);
const categoryRouter = require('./dto/categorys.js');
app.use('/category', categoryRouter);

const tagRouter = require('./dto/tags.js');
app.use('/tag', tagRouter);



// 서버 실행
app.listen(port, () => {
  console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});