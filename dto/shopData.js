const mariadb = require('mariadb');
const express = require('express');
const router = express.Router();
const config = require('../DBconfig.json');
const path = require('path');
const fs = require('fs');

const pool = mariadb.createPool({
  host: config.db.host,
  user: config.db.user,
  password: config.db.password,
  database: config.db.database,
  // connectionLimit: 100,
  // idleTimeout: 60000,
});

router.get('/getCategory', async (req, res) => {
    // try {
    //   console.log('test1');
    //   const conn = await pool.getConnection();
    //   console.log('test2');
    //   const result = await conn.query('SELECT * FROM category');
    //   console.log('test3');
    //   conn.release();
    //   console.log('가져오기 성공');
    //   res.status(200).json(result);
    // } catch (error) {
    //   console.error('카테고리 가져오기 에러:', error);
    //   res.status(500).send('카테고리 가져오기 실패');
    // }
    try {
      // JSON 파일 경로 설정
      const filePath = path.join(__dirname, '../frontend/src/data/category.json');
      
      // 파일 읽기
      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
          console.error("카테고리 파일 읽기 에러:", err);
          return res.status(500).send("카테고리 파일 읽기 실패");
        }
  
        // 읽어온 JSON 데이터를 클라이언트로 보내기
        res.status(200).send(data);
      });

    } catch (error) {
      console.error("카테고리 가져오기 에러:", error);
      res.status(500).send("카테고리 가져오기 실패");
    }
  });

  router.get('/getTag', async (req, res) => {
    // try {
    //   const conn = await pool.getConnection();
    //   const result = await conn.query('SELECT * FROM tag');
    //   conn.release();
    //   console.log('tag 가져오기 성공');
    //   res.status(200).json(result);
    // } catch (error) {
    //   console.error('tag 가져오기 에러:', error);
    //   res.status(500).send('tag 가져오기 실패');
    // }
    try {
      // JSON 파일 경로 설정
      const filePath = path.join(__dirname, '../frontend/src/data/tag.json');
      
      // 파일 읽기
      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
          console.error("태그 파일 읽기 에러:", err);
          return res.status(500).send("태그 파일 읽기 실패");
        }
  
        // 읽어온 JSON 데이터를 클라이언트로 보내기
        res.status(200).send(data);
      });
    } catch (error) {
      console.error("태그 가져오기 에러:", error);
      res.status(500).send("태그가져오기 실패");
    }
  });

  router.get('/getOption', async (req, res) => {
    // try {
    //   const conn = await pool.getConnection();
    //   const result = await conn.query('SELECT * FROM details');
    //   //const result = await conn.query('SELECT * FROM DETAILS');
    //   conn.release();
    //   console.log('옵션 가져오기 성공');
    //   res.status(200).json(result);
    // } catch (error) {
    //   console.error('옵션 가져오기 에러:', error);
    //   res.status(500).send('옵션 가져오기 실패');
    // }
    try {
      // JSON 파일 경로 설정
      const filePath = path.join(__dirname, '../frontend/src/data/option.json');
      
      // 파일 읽기
      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
          console.error("옵션 파일 읽기 에러:", err);
          return res.status(500).send("옵션 파일 읽기 실패");
        }
  
        // 읽어온 JSON 데이터를 클라이언트로 보내기
        res.status(200).send(data);
      });
    } catch (error) {
      console.error("옵션 가져오기 에러:", error);
      res.status(500).send("옵션 가져오기 실패");
    }
  });

  router.get('/getProduct', async (req, res) => {
    // try {
    //   const conn = await pool.getConnection();
    //   const result = await conn.query('SELECT * FROM product');
    //   //magaer, shop 데이터를 추가로 req에 넣어야 함 - 맞는 유저의 매장의 메뉴 가져오는 WHERE문

    //   conn.release();
    //   console.log('제품 가져오기 성공');
    //   res.status(200).json(result);
    // } catch (error) {
    //   console.error('제품 가져오기 에러:', error);
    //   res.status(500).send('제품 가져오기 실패');
    // }
    try {
      // JSON 파일 경로 설정
      const filePath = path.join(__dirname, '../frontend/src/data/product.json');
      
      // 파일 읽기
      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
          console.error("상품 파일 읽기 에러:", err);
          return res.status(500).send("상품 파일 읽기 실패");
        }
  
        // 읽어온 JSON 데이터를 클라이언트로 보내기
        res.status(200).send(data);
      });
    } catch (error) {
      console.error("상품 가져오기 에러:", error);
      res.status(500).send("상품 가져오기 실패");
    }
  });

  
  router.get('/getTagMenu', async (req, res) => {
    // try {
    //   const conn = await pool.getConnection();
    //   const result = await conn.query('SELECT * FROM menutag');
    //   //magaer, shop 데이터를 추가로 req에 넣어야 함 - 맞는 유저의 매장의 메뉴 가져오는 WHERE문

    //   conn.release();
    //   console.log('menutag 가져오기 성공');
    //   res.status(200).json(result);
    // } catch (error) {
    //   console.error('menutag 가져오기 에러:', error);
    //   res.status(500).send('menutag 가져오기 실패');
    // }
    try {
      // JSON 파일 경로 설정
      const filePath = path.join(__dirname, '../frontend/src/data/tagMenu.json');
      
      // 파일 읽기
      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
          console.error("태그메뉴 파일 읽기 에러:", err);
          return res.status(500).send("태그메뉴 파일 읽기 실패");
        }
  
        // 읽어온 JSON 데이터를 클라이언트로 보내기
        res.status(200).send(data);
      });
    } catch (error) {
      console.error("태그메뉴 가져오기 에러:", error);
      res.status(500).send("태그메뉴 가져오기 실패");
    }
  });

router.get('/getUserData', async (req, res) => {
  try {
    const conn = await pool.getConnection();
    const result = await conn.query('SELECT * FROM manager');
    //const result = await conn.query('SELECT * FROM MANAGER');
    conn.release();
    console.log('유저 가져오기 성공');
    res.status(200).json(result);
  } catch (error) {
    console.error('유저 가져오기 에러:', error);
    res.status(500).send('옵션 가져오기 실패');
  }
});

module.exports = router