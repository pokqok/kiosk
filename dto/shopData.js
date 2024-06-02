const mariadb = require('mariadb');
const express = require('express');
const router = express.Router();
const config = require('../DBconfig.json');

const pool = mariadb.createPool({
  host: config.db.host,
  user: config.db.user,
  password: config.db.password,
  database: config.db.database,
  // connectionLimit: 100,
  // idleTimeout: 60000,
});

// const pool = mariadb.createPool({
//   host: "localhost",
//   user: "manager",
//   password: "manager",
//   database: "kiosk",
// });



router.get('/getCategory', async (req, res) => {
    try {
      console.log('test1');
      const conn = await pool.getConnection();
      console.log('test2');
      const result = await conn.query('SELECT * FROM category');
      console.log('test3');
      conn.release();
      console.log('가져오기 성공');
      res.status(200).json(result);
    } catch (error) {
      console.error('카테고리 가져오기 에러:', error);
      res.status(500).send('카테고리 가져오기 실패');
    }
  });

  router.get('/getTag', async (req, res) => {
    try {
      const conn = await pool.getConnection();
      const result = await conn.query('SELECT * FROM tag');
      conn.release();
      console.log('tag 가져오기 성공');
      res.status(200).json(result);
    } catch (error) {
      console.error('tag 가져오기 에러:', error);
      res.status(500).send('tag 가져오기 실패');
    }
  });

  router.get('/getOption', async (req, res) => {
    try {
      const conn = await pool.getConnection();
      const result = await conn.query('SELECT * FROM details');
      //const result = await conn.query('SELECT * FROM DETAILS');
      conn.release();
      console.log('옵션 가져오기 성공');
      res.status(200).json(result);
    } catch (error) {
      console.error('옵션 가져오기 에러:', error);
      res.status(500).send('옵션 가져오기 실패');
    }
  });

  router.get('/getProduct', async (req, res) => {
    try {
      const conn = await pool.getConnection();
      const result = await conn.query('SELECT * FROM product');
      //magaer, shop 데이터를 추가로 req에 넣어야 함 - 맞는 유저의 매장의 메뉴 가져오는 WHERE문

      conn.release();
      console.log('제품 가져오기 성공');
      res.status(200).json(result);
    } catch (error) {
      console.error('제품 가져오기 에러:', error);
      res.status(500).send('제품 가져오기 실패');
    }
  });

  
  router.get('/getTagMenu', async (req, res) => {
    try {
      const conn = await pool.getConnection();
      const result = await conn.query('SELECT * FROM menutag');
      //magaer, shop 데이터를 추가로 req에 넣어야 함 - 맞는 유저의 매장의 메뉴 가져오는 WHERE문

      conn.release();
      console.log('menutag 가져오기 성공');
      res.status(200).json(result);
    } catch (error) {
      console.error('menutag 가져오기 에러:', error);
      res.status(500).send('menutag 가져오기 실패');
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



/*

//유저에 해당하는 샵=키오스크 가져오기 (아마 userModule에서 같이 할 거 같음)
router.get('/getShopData', async (req, res) => {
    try {

    const { id } = req.body;

      const conn = await pool.getConnection();
      const result = await conn.query(`SELECT * FROM shop WHERE UserID = ${id}}`);
      // const result = await conn.query(`SELECT * FROM SHOP WHERE UserID = ${id}}`);
      conn.release();
      console.log('유저 가져오기 성공');
      res.status(200).json(result);
    } catch (error) {
      console.error('유저 가져오기 에러:', error);
      res.status(500).send('옵션 가져오기 실패');
    }
  });


//메뉴 가져오기.
router.get('/getShopMenu', async (req, res) => {
    try {
        const { shopId } = req.body; // 상점 ID 가져오기
        const conn = await pool.getConnection();
        const shopMenuResult = await conn.query(`SELECT * FROM shopmenu WHERE ShopID = '${shopId}'`); // 상점의 메뉴 정보 가져오기
        conn.release();

        // 가져온 shopmenu의 각 레코드에서 제품 번호(ProductNO)를 사용하여 제품 테이블(product)에서 실제 제품 정보를 가져옵니다.
        const shopMenuWithProducts = [];
        for (const menuItem of shopMenuResult) {
            const productResult = await conn.query(`SELECT * FROM product WHERE ProductNO = '${menuItem.ProductNO}'`);
            if (productResult.length > 0) {
                shopMenuWithProducts.push({ ...menuItem, product: productResult[0] }); // 메뉴 정보와 해당 제품 정보를 합쳐서 저장
            }
        }

        console.log('상점 메뉴 가져오기 성공');
        res.status(200).json(shopMenuWithProducts); // 상점의 메뉴 정보와 해당 제품 정보를 응답으로 전송
    } catch (error) {
        console.error('상점 메뉴 가져오기 에러:', error);
        res.status(500).send('상점 메뉴 가져오기 실패');
    }
});

let transaction; //트랜잭션용

// 태그 추가
router.post('/signIn', async (req, res) => {
    try {
      const { id, password, phoneNo } = req.body;
  
      // 중복된 ID가 있는지 확인
      const conn = await pool.getConnection();
      const existingUser = await conn.query(`SELECT * FROM manager WHERE UserID = '${id}'`);
      conn.release();
  
      // 중복된 ID가 없는 경우에만 사용자 추가
      if (existingUser.length === 0) {
        if (!transaction) {
          transaction = await pool.getConnection();
          await transaction.query('START TRANSACTION');
        }
        console.log("test image: " + image);
        
        await transaction.query(`INSERT INTO manager (UserID, Password, UserPhone) VALUES ('${id}','${password}', '${phoneNo}')`);
        console.log('추가 성공');
        res.status(200).send('유저 추가 성공');
      } else {
        // 중복된 ID가 이미 존재하는 경우 에러 처리
        console.error('중복된 ID입니다.');
        res.status(409).send('중복된 ID입니다.'); //코드에서 status 409로 중복추가 오류 코드 처리할 것
      }
    } catch (error) {
      console.error('유저 추가 에러:', error);
      if (transaction) {
        await transaction.rollback();
        transaction.release();
        transaction = undefined;
      }
      res.status(500).send('유저 추가 실패');
    }
  });

  

// 태그 삭제
router.post('/deleteUser', async (req, res) => {
  try {
    const { id } = req.body;
    if (!transaction) {//위와 동일하다.
      transaction = await pool.getConnection();
      await transaction.query('START TRANSACTION');
    }
    await transaction.query(`DELETE FROM manager WHERE UserID = '${id}'`);

    console.log('유저 삭제 성공');
    res.status(200).send('유저 삭제');
  } catch (error) {
    console.error('유저 삭제 에러:', error);
    if (transaction) {
      await transaction.rollback();
      transaction.release();
      transaction = undefined;
    }
    res.status(500).send('유저 삭제 실패');
  }
});

router.post('/updatePassword', async (req, res) => {
    try {
      const { id, password,phoneNo } = req.body;
      if (!transaction) {
        transaction = await pool.getConnection();
        await transaction.query('START TRANSACTION');
      } 
  
      // 비밀번호 업데이트
      await transaction.query(`UPDATE manager SET Password = '${password}', UserPhone = '${phoneNo}' WHERE UserID = '${id}'`);
  
      console.log('비밀번호 업데이트 성공');
      res.status(200).send('비밀번호 업데이트 성공');
    } catch (error) {
      console.error('비밀번호 업데이트 에러:', error);
      if (transaction) {
        await transaction.rollback();
        transaction.release();
        transaction = undefined;
      }
      res.status(500).send('비밀번호 업데이트 실패');
    }
  });
  
//SHOP 수정 코드
  router.post('/addShop', async (req, res) => {
    try {
      const { id, name, userId } = req.body;
  
      // 데이터베이스에서 샵 정보 추가
      const conn = await pool.getConnection();
      await conn.query(`INSERT INTO shop (ShopID, ShopName, UserID) VALUES ('${id}', '${name}', '${userId}')`);
      conn.release();
      // 샵 추가 성공 메시지 반환
      console.log('샵 추가 성공');
      res.status(200).send('샵 추가 성공');
    } catch (error) {
      // 에러 발생 시 에러 메시지를 반환
      console.error('샵 추가 에러:', error);
      res.status(500).send('샵 추가 도중 에러 발생');
    }
  });

router.post('/deleteShop', async (req, res) => {
    try {
      const { id } = req.body;
  
      // 데이터베이스에서 샵 삭제
      const conn = await pool.getConnection();
      await conn.query(`DELETE FROM shop WHERE ShopID = '${id}'`);
      conn.release();
  
      // 샵 삭제 성공 메시지 반환
      console.log('샵 삭제 성공');
      res.status(200).send('샵 삭제 성공');
    } catch (error) {
      // 에러 발생 시 에러 메시지를 반환
      console.error('샵 삭제 에러:', error);
      res.status(500).send('샵 삭제 도중 에러 발생');
    }
  });
  
  router.post('/updateShop', async (req, res) => {
    try {
      const { id, name, userId } = req.body;
  
      // 데이터베이스에서 샵 정보 업데이트
      const conn = await pool.getConnection();
      await conn.query(`UPDATE shop SET ShopName = '${name}', UserID = '${userId}' WHERE ShopID = '${id}'`);
      conn.release();
  
      // 샵 업데이트 성공 메시지 반환
      console.log('샵 정보 업데이트 성공');
      res.status(200).send('샵 정보 업데이트 성공');
    } catch (error) {
      // 에러 발생 시 에러 메시지를 반환
      console.error('샵 정보 업데이트 에러:', error);
      res.status(500).send('샵 정보 업데이트 도중 에러 발생');
    }
  });
  
//최종 적용하는 SQL코드 부분

router.post('/apply', async (req, res) => {
  // 태그 적용
  try {
    if (transaction) {
      await transaction.commit();
      transaction.release();
      transaction = undefined;
    }//트랜잭션 존재 시, 커밋하고 초기화
    res.status(200).send('변경 사항이 성공적으로 적용되었습니다.');
  } catch (error) {
    console.error('변경 사항 적용 에러:', error);
    res.status(500).send('변경 사항을 적용하는 도중 에러가 발생했습니다.');
  }
});

router.post('/cancel', async (req, res) => {
  // 태그 롤백
  try {
    if (transaction) {
      await transaction.rollback();
      transaction.release();
      transaction = undefined;
    }//트랜잭션 존재 시, 롤백하고 초기화
    res.status(200).send('변경 사항이 취소되었습니다.');
  } catch (error) {
    console.error('변경 사항 취소 에러:', error);
    res.status(500).send('변경 사항을 취소하는 도중 에러가 발생했습니다.');
  }
});
*/

module.exports = router;
