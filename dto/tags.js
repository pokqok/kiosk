const mariadb = require("mariadb");
const express = require("express");
const router = express.Router();
const config = require("../DBconfig.json");
const path = require('path');
const fs = require('fs');

const pool = mariadb.createPool({
  host: config.db.host,
  user: config.db.user,
  password: config.db.password,
  database: config.db.database,
});

const TAG_FILE_PATH = path.join(__dirname, '../frontend/src/data/tag.json');

router.get("/", async (req, res) => {
  console.log("태그 진입 test");
  res.status(200).send("tag test");
});

router.get("/getTag", async (req, res) => {
  // try {
  //   const conn = await pool.getConnection();
  //   const result = await conn.query("SELECT * FROM TAG");
  //   conn.release();
  //   console.log("TAG 가져오기 성공");
  //   res.status(200).json(result);
  // } catch (error) {
  //   console.error("TAG 가져오기 에러:", error);
  //   res.status(500).send("TAG 가져오기 실패");
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

let transaction; //트랜잭션용

// 태그 추가
router.post("/addTag", async (req, res) => {
  try {
    //{ TagId: newTag.id, TagName: newTag.name, TagAlias: newTag.alias, TagDescription: newTag.description }
    const { TagId, TagName, TagAlias, TagDescription } = req.body;

    if (!transaction) {
      //트랜잭션이 비어있음 여기서 start transaction함
      transaction = await pool.getConnection();
      await transaction.query("START TRANSACTION");
    } //만약 아니면 이미 있다는 것이니 이어서 실행

    await transaction.query(
      `INSERT INTO TAG (TagNO, TagName, TagAlias, TagDet, IsOn, IsRequired) VALUES (${TagId},'${TagName}', '${TagAlias}','${TagDescription}',true, false)`
    );
    console.log("추가 성공");
    res.status(200).send("카테고리 추가 성공");

    /*
    await transaction.commit();
    transaction.release();
    transaction = undefined;*/

    //이거 테스트용, apply 구현 후 삭제할 예정임
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
router.post("/deleteTag", async (req, res) => {
  try {
    const { TagId } = req.body;
    if (!transaction) {
      //위와 동일하다.
      transaction = await pool.getConnection();
      await transaction.query("START TRANSACTION");
    }
    await transaction.query(`DELETE FROM TAG WHERE TagNO = ${TagId}`);
    console.log("TAG 삭제 성공");
    res.status(200).send("TAG 삭제");
  } catch (error) {
    console.error("TAG 삭제 에러:", error);
    if (transaction) {
      await transaction.rollback();
      transaction.release();
      transaction = undefined;
    }
    res.status(500).send("TAG 삭제 실패");
  }
});

// 태그 변경
router.post("/updateTag", async (req, res) => {
  try {
    const { TagId, TagName, TagAlias, TagDescrption } = req.body;
    if (!transaction) {
      transaction = await pool.getConnection();
      await transaction.query("START TRANSACTION");
    }
    await transaction.query(
      `UPDATE TAG SET TagName = '${TagName}', TagAlias = '${TagAlias}', TagDet = '${TagDescrption}' WHERE TagNO = ${TagId}`
    );
    console.log("수정 성공");
    res.status(200).send("카테고리 수정 성공");
  } catch (error) {
    console.error("카테고리 수정 에러:", error);
    //참조 에러 시 cascade 적용해서 details은 자동으로 사라지거나 같이 변경됨
    if (transaction) {
      await transaction.rollback();
      transaction.release();
      transaction = undefined;
    }
    res.status(500).send("카테고리 수정 실패");
  }
});

//await axios.post(HOST+'tag/toggleIsOn', {TagId: id, TagOn: isOn} );
router.post("/toggleIsOn", async (req, res) => {
  try {
    const { TagId, TagOn } = req.body;
    if (!transaction) {
      transaction = await pool.getConnection();
      await transaction.query("START TRANSACTION");
    }

    let switchOn;
    TagOn != TagOn; //이건 굳이 필요없..나? front에서는 v-switch가 자동으로 바꾸어주긴 하나 여긴 보낸 데이터라
    //mariaDB는 bool 구문 인식을 1/0 으로 하기에 혹시몰라서 추가함
    if (TagOn == true) {
      switchOn = 1;
    } else {
      switchOn = 0;
    }
    await transaction.query(
      `UPDATE TAG SET IsOn = ${switchOn} WHERE TagNO = ${TagId}`
    );

    console.log("수정 성공");
    res.status(200).send("스위칭 성공");
  } catch (error) {
    console.error("스위칭 에러:", error);
    if (transaction) {
      await transaction.rollback();
      transaction.release();
      transaction = undefined;
    }
    res.status(500).send("스위칭 실패");
  }
});

//await axios.post(HOST+'tag/toggleRequired', {TagId: id, TagOn: isRequired} );
router.post("/toggleRequired", async (req, res) => {
  try {
    const { TagId, TagOn } = req.body;
    if (!transaction) {
      transaction = await pool.getConnection();
      await transaction.query("START TRANSACTION");
    }

    let switchOn;
    TagOn != TagOn; //이건 굳이 필요없..나? front에서는 v-switch가 자동으로 바꾸어주긴 하나 여긴 보낸 데이터라
    //mariaDB는 bool 구문 인식을 1/0 으로 하기에 혹시몰라서 추가함
    if (TagOn == true) {
      switchOn = 1;
    } else {
      switchOn = 0;
    }
    await transaction.query(
      `UPDATE TAG SET isRequired = ${switchOn} WHERE TagNO = ${TagId}`
    );

    console.log("수정 성공");
    res.status(200).send("스위칭 성공");
  } catch (error) {
    console.error("스위칭 에러:", error);
    if (transaction) {
      await transaction.rollback();
      transaction.release();
      transaction = undefined;
    }
    res.status(500).send("스위칭 실패");
  }
});

router.post("/apply", async (req, res) => {
  // 태그 적용
  // try {
  //   if (transaction) {
  //     await transaction.commit();
  //     transaction.release();
  //     transaction = undefined;
  //   } //트랜잭션 존재 시, 커밋하고 초기화
  //   res.status(200).send("변경 사항이 성공적으로 적용되었습니다.");
  // } catch (error) {
  //   console.error("변경 사항 적용 에러:", error);
  //   res.status(500).send("변경 사항을 적용하는 도중 에러가 발생했습니다.");
  // }

  try {
    const tag = req.body;
    fs.writeFileSync(TAG_FILE_PATH, JSON.stringify(tag, null, 2), 'utf8');
    res.status(200).send("변경 사항이 성공적으로 적용되었습니다.");
  } catch (error) {
    console.error("변경 사항 적용 에러:", error);
    res.status(500).send("변경 사항을 적용하는 도중 에러가 발생했습니다.");
  }
});

router.post("/cancel", async (req, res) => {
  // 태그 롤백
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
