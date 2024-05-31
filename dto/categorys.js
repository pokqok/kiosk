// 카테고리 설정 쿼리 파일
const mariadb = require("mariadb");
const express = require("express");
const router = express.Router();
const config = require("../DBconfig.json");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
/*


*/
const pool = mariadb.createPool({
  host: config.db.host,
  user: config.db.user,
  password: config.db.password,
  database: config.db.database,
});

let transaction; // 공유되는 트랜잭션임
//이걸로 apply/cancel해야 거기서 commit/rollback을 해줌


const CATEGORY_FILE_PATH = path.join(__dirname, '../frontend/src/data/category.json');
//const CATEGORY_FILE_PATH = '../frontend/src/data/category.json';


// DB 가져오기
router.get("/getAllCategories", async (req, res) => {
  // try {
  //   const conn = await pool.getConnection();
  //   const result = await conn.query("SELECT * FROM CATEGORY");
  //   conn.release();
  //   res.status(200).json(result);
  // } catch (error) {
  //   console.error("카테고리 가져오기 에러:", error);
  //   res.status(500).send("카테고리 가져오기 실패");
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

// 태그 추가
router.post("/add", async (req, res) => {
  try {
    const { categoryId, categoryName } = req.body;
    if (!transaction) {
      //트랜잭션이 비어있음 여기서 start transaction함
      transaction = await pool.getConnection();
      await transaction.query("START TRANSACTION");
    } //만약 아니면 이미 있다는 것이니 이어서 실행
    await transaction.query(
      `INSERT INTO CATEGORY (CategoryNO, CategoryName, CategoryAlias) VALUES (${categoryId},'${categoryName}', NULL)`
    );
    console.log("추가 성공");
    res.status(200).send("카테고리 추가 성공");
  } catch (error) {
    console.error("카테고리 추가 에러:", error);
    if (transaction) {
      await transaction.rollback();
      transaction.release();
      transaction = undefined;
    }
    res.status(500).send("카테고리 추가 실패");
  }
});

// 태그 삭제
router.post("/delete", async (req, res) => {
  try {
    const { categoryId } = req.body;
    if (!transaction) {
      //위와 동일하다.
      transaction = await pool.getConnection();
      await transaction.query("START TRANSACTION");
    }
    //console.log('this is :' + categoryId);
    await transaction.query(
      `DELETE FROM CATEGORY WHERE CategoryNO = ${categoryId}`
    );
    console.log("삭제 성공");
    res.status(200).send("카테고리 삭제 성공");
  } catch (error) {
    console.error("카테고리 삭제 에러:", error);
    if (transaction) {
      await transaction.rollback();
      transaction.release();
      transaction = undefined;
    }
    res.status(500).send("카테고리 삭제 실패");
  }
});

// 태그 수정
router.post("/update", async (req, res) => {
  try {
    const { categoryId, categoryName } = req.body;
    if (!transaction) {
      transaction = await pool.getConnection();
      await transaction.query("START TRANSACTION");
    }
    await transaction.query(
      `UPDATE CATEGORY SET CategoryName = '${categoryName}' WHERE CategoryNO = ${categoryId}`
    );
    console.log("수정 성공");
    res.status(200).send("카테고리 수정 성공");
  } catch (error) {
    console.error("카테고리 수정 에러:", error);
    if (transaction) {
      await transaction.rollback();
      transaction.release();
      transaction = undefined;
    }
    res.status(500).send("카테고리 수정 실패");
  }
});

//태그 on/off
router.post("/toggle", async (req, res) => {
  try {
    const { categoryId, categoryOn } = req.body;
    if (!transaction) {
      transaction = await pool.getConnection();
      await transaction.query("START TRANSACTION");
    }
    let switchOn;
    categoryOn != categoryOn; //이건 굳이 필요없..나? front에서는 v-switch가 자동으로 바꾸어주긴 하나 여긴 보낸 데이터라
    //mariaDB는 bool 구문 인식을 1/0 으로 하기에 혹시몰라서 추가함
    if (categoryOn == true) {
      switchOn = 1;
    } else {
      switchOn = 0;
    }
    //console.log(categoryId.isOn);
    //아니 왜 categoryID만 보냈는데 이게 보내지는가?...했더니 하나로 뭉쳐서 보냈음
    await transaction.query(
      `UPDATE CATEGORY SET IsOn = ${switchOn} WHERE CategoryNO = ${categoryId}`
    );

    console.log("수정 성공");
    res.status(200).send("카테고리 수정 성공");
  } catch (error) {
    console.error("카테고리 수정 에러:", error);
    if (transaction) {
      await transaction.rollback();
      transaction.release();
      transaction = undefined;
    }
    res.status(500).send("카테고리 수정 실패");
  }
});


router.post("/apply", async (req, res) => {
  try {
    // if (transaction) {
    //   await transaction.commit();
    //   transaction.release();
    //   transaction = undefined;
    // }

    const categories = req.body;
    fs.writeFileSync(CATEGORY_FILE_PATH, JSON.stringify(categories, null, 2), 'utf8');
    
    res.status(200).send("변경 사항이 성공적으로 적용되었습니다.");
  } catch (error) {
    console.error("변경 사항 적용 에러:", error);
    res.status(500).send("변경 사항을 적용하는 도중 에러가 발생했습니다.");
  }
});

// 변경 사항 취소
router.post("/cancel", async (req, res) => {
  try {
    if (transaction) {
      await transaction.rollback();
      transaction.release();
      transaction = undefined;
    } //트랜잭션 존재 시, 롤백하고 초기화
    res.status(200).send("변경 사항이 취소되었습니다.");
  } catch (error) {
    console.error("변경 사항 취소 에러:", error);
    res.status(500).send("변경 사항을 취소하는 도중 에러가 발생했습니다.");
  }
});

module.exports = router;
