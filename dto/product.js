const mariadb = require("mariadb");
const express = require("express");
const router = express.Router();
const config = require("../DBconfig.json");
const path = require('path');
const fs = require('fs');
/*
*/
const pool = mariadb.createPool({
  host: config.db.host,
  user: config.db.user,
  password: config.db.password,
  database: config.db.database,
});

//let transaction;
const PRODUCT_FILE_PATH = path.join(__dirname, '../frontend/src/data/product.json');

router.post('/addProduct', async (req, res) => {
    try {
        console.log("DB에 상품 추가 시작");
        const { product } = req.body;
        const conn = await pool.getConnection();
        await conn.query(`INSERT INTO product (ProductNO, ProductName, Price, CategoryNO, ProductDetail, ProductImage, ProductAlias, isOn) 
        VALUES (?, ?, ?, ?, ?, 'default.png', ?, true)`, [product.id, product.name, product.price, product.category, product.detail, /*product.image*/, product.alias]);

        for (let j = 0; j < product.tags.length; j++) {
            await conn.query(`
              INSERT INTO menutag (ProductNO, TagNO, orderNo) 
              VALUES (?, ?, ?)
            `, [product.id, product.tags[j], j + 1]);
        }
        
        conn.release();
        console.log('추가 성공');
        res.status(200).send('상품 추가 성공');
    } catch (error) {
        console.error('상품 추가 에러:', error);
        res.status(500).send('추가 실패');
    }
});

router.post('/changeProduct', async (req, res) => {
    // try {
    //     console.log("DB에 상품 변경 시작");
    //     const { product } = req.body;
    //     const conn = await pool.getConnection();
    //     console.log("ㅎ닝라ㅓㅠㅎㅇㄹㄶ:",product.name)
    //     // 상품 정보 업데이트
    //     await conn.query(`
    //         UPDATE product 
    //         SET ProductName = ?, Price = ?, CategoryNO = ?, ProductDetail = ?, ProductAlias = ?
    //         WHERE ProductNO = ?
    //     `, [product.name, product.price, product.category, product.detail, product.alias, product.id]);

    //     // 태그 정보 업데이트
    //     // 먼저 기존 태그 정보 삭제
    //     await conn.query(`DELETE FROM menutag WHERE ProductNO = ?`, [product.id]);
    //     // 새로운 태그 정보 추가
    //     for (let j = 0; j < product.tags.length; j++) {
    //         await conn.query(`
    //           INSERT INTO menutag (ProductNO, TagNO, orderNo) 
    //           VALUES (?, ?, ?)
    //         `, [product.id, product.tags[j], j + 1]);
    //     }

    //     conn.release();
    //     console.log('변경 성공');
    //     res.status(200).send('상품 변경 성공');
    // } catch (error) {
    //     console.error('상품 변경 에러:', error);
    //     res.status(500).send('변경 실패');
    // }

    try {
      console.log("DB에 상품 변경 시작");
      const product = req.body;
      fs.writeFileSync(PRODUCT_FILE_PATH, JSON.stringify(product, null, 2), 'utf8');
      console.log('변경 성공');
      res.status(200).send('상품 변경 성공');
  } catch (error) {
      console.error('상품 변경 에러:', error);
      res.status(500).send('변경 실패');
  }
});

  router.post('/deleteProduct', async (req, res) => {
    try {
        const { productId } = req.body;
    
        // if (!transaction) {
        //     transaction = await pool.getConnection();
        //     await transaction.query("START TRANSACTION");
        // }

        const conn = await pool.getConnection();
    
        await conn.query(`DELETE FROM product WHERE ProductNO = ${productId}`);

        conn.release();
        console.log('삭제 성공');
        res.status(200).send('상품 삭제 성공');
       
    } catch (error) {
      console.error('상품 삭제 에러:', error);
      if (transaction) {
        await conn.rollback();
        conn.release();
        //conn = undefined;
      }
      res.status(500).send('삭제 실패');
    }
  });
  
module.exports = router;