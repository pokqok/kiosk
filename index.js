require("dotenv").config();
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const fs = require("fs");
const request = require("request");
const multer = require("multer");
const bodyParser = require("body-parser");
const path = require("path");
const jwt = require("jsonwebtoken");
const app = express();
const { Server } = require("socket.io");
const server = http.createServer(app);
const axios = require("axios");
const { SpeechClient } = require("@google-cloud/speech").v2;
const oracledb = require("oracledb");
const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require("@google/generative-ai");
const wordnet = require('wordnet')
const mariadb = require('mariadb');

const config = require('./DBconfig.json');

const pool = mariadb.createPool({
  host: config.db.host,
  user: config.db.user,
  password: config.db.password,
  database: config.db.database,
});

app.use(express.static(__dirname)); // 정적 파일 제공을 위해 추가
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
var upload = multer({ dest: __dirname });

const cors = require("cors");
app.use(cors()); // 모든 요청에 대해 CORS 허용

const io = new Server(server, {
  cors: {
    origin: "*", // 모든 출처에서의 요청을 허용하도록 설정
    methods: ["GET", "POST"],
    credentials: true,
  },
});

console.log(process.env.GOOGLE_APPLICATION_CREDENTIALS); // 환경 변수 테스트 출력

// 제미니 api

// node --version # Should be >= 18
// npm install @google/generative-ai
const MODEL_NAME = "gemini-1.5-pro-latest";
process.env.GOOGLE_APPLICATION_CREDENTIALS;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;; // Replace with your actual API key
console.log("API_KEY:", GEMINI_API_KEY);


async function getMenuItems() {
  let connection;
  try {
      // MariaDB와의 연결
      connection = await pool.getConnection();

      const tags = await connection.execute( `SELECT * FROM tag`);
      const options = await connection.execute( `SELECT * FROM details`);
      const tagMenu = await connection.execute( `SELECT * FROM menutag`);
      const categories = await connection.execute( `SELECT * FROM category`);
      const products = await connection.execute( `SELECT * FROM product`);

      if (connection) {
        await connection.release(); // 연결 해제
      }
      //console.log("product: ",tagMenu);
      //return rows; // 결과를 그대로 반환
      
      return products.map(product => {
        const productCategory = categories.find(category => category.CategoryNO == product.CategoryNO);
        const productWithTagOptions = tagMenu.filter(item => item.ProductNO == product.ProductNO);
        const productTags = productWithTagOptions.map(tagOption => {
            const tag = tags.find(tag => tag.TagNO == tagOption.TagNo);
            return { id: tag.TagNO, name: tag.TagName };
        });
  
        const productOptions = productWithTagOptions.map(tagOption => {
          const filteredOptions = options.filter(option => option.TagNO == tagOption.TagNo);
          const optionsArray = filteredOptions.map(option => ({
              id: option.DetNO,
              name: option.DetName,
              price: option.AddPrice,
              image: option.DetImage,
              alias: option.DetAlias,
              orderNo: option.orderNo,
              duplicate: option.isDup,
          }));
          return optionsArray;
        });

        // 제품 정보를 새로운 형식으로 변환하여 반환 

        return {
            productId: product.ProductNO,
            productName: product.ProductName,
            category: {
                id: productCategory.CategoryNO,
                name: productCategory.CategoryName,
                alias: productCategory.CategoryAlias,
                //isOn: productCategory.isOn === undefined ? true : productCategory.isOn,
            },
            tags: productTags,
            options: productOptions,
           //options: productTags.map(tag => productOptions.filter(option => option.TagNO == tag.TagNO)),
        };
       
      });


  } catch (err) {
      console.error('Error while fetching menu items:', err);
      throw err;  // 또는 적절한 에러 처리
  } finally {
      if (connection) {
          await connection.release(); // 연결 해제
      }
  }
}

app.get('/api/menu-items', async (req, res) => {
    try {
        const items = await getMenuItems();
        res.json(items);
    } catch (err) {
        res.status(500).send('Server error while fetching menu items');
    }
});

const menuItems = getMenuItems();

const Monthly_recommendedItems = [
  {
    name: '아메리카노',
    id: 1,
   },
   {
     name: '카페라떼',
     id: 2,
    },
    {
     name: '민트티',
     id: 7,
  }
];

app.post('/chat', async (req, res) => {
  try {
    const userInput = req.body.userInput;
    console.log("Chat request received:", userInput);
    //const menuItems = getMenuItems();

    const items = await getMenuItems(); // getMenuItems()의 실행이 완료될 때까지 대기
    items.forEach(item => {
      const category = item.category;
      const isOn = category.isOn === undefined ? true : category.isOn;
      
      // console.log("Product ID:", item.productId);
      // console.log("Product Name:", item.productName);
      // console.log("Category ID:", category.id);
      // console.log("Category Name:", category.name);
      // console.log("Category Alias:", category.alias);
      // console.log("Is Category On:", isOn);
      // console.log("Tags:", item.tags);
      // console.log("Options:", item.options);
      // console.log("-----------------------");
    });

    //console.log('test:', JSON.stringify(items));
    console.log(JSON.stringify(Monthly_recommendedItems));
    
    const generationConfig = {
      temperature: 1,
      topK: 0,
      topP: 0.95,
      maxOutputTokens: 8192,
    };

    const safetySettings = [
      { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
      { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
      { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
      { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    ];

    // const parts = [
    //   { text: `input: ${JSON.stringify(menuItems)},${JSON.stringify(Monthly_recommendedItems)}` }, // Convert to JSON strings
    //   {
    //     text: `output: 메뉴 반환 형식은 각 메뉴마다 1번부터 번호를 붙이고, 메뉴이름에 ** 메뉴 ** 를 붙이지 말아줘. \n1. 메뉴이름 - 당도 : 가능한 당도 옵션 - 온도 : 가능한 온도 옵션 - 카페인 여부 \n 2. 메뉴이름 - 당도 : 가능한 당도 옵션 - 온도 : 가능한 온도 옵션 \n 이렇게 해줘\n이외에는 필요없어\n최대 3개 까지만\n\n이달의 추천메뉴가 쿼리로 주어질때는 recommendedItems의 내용만 출력해줘. ## 차가운 음료 메뉴: 이렇게 꾸미지 않아도 괜찮아.
    //     만약 특정 옵션 테이블 중 알맞는 옵션이 사전에 제공이 되어있으면 그것만 출력해줘. 만약 메뉴 이름이 정확한게 왔으면 그것만 출력해줘. 예를 들어서 바닐라 라떼, 이런식으로 오면 바닐라 라떼에 대한것만 출력해.` },
    //   { text: `input: ${userInput}` },
    //   { text: "output: " },
    //];

    const parts = [
      {text: `질문에 맞는 메뉴의 아이디를 찾아 productId: [] 형식으로 반환하라,
      \n 질문에 맞는 단어가 없다면 발음이나 철자가 비슷한지를 찾아라.
      \n 만약 어떤 메뉴와도 상응하는 데이터를 찾지 못하겠다면 모든 메뉴 productId를 반환해라`},
      {text: `input: ${JSON.stringify(items)}` },
      {text: "output: 타겟팅: {categoryId:null, tagId:1, optionId:1, productId:null, recommened: null\n}\n검색결과: 아메리카노, 카페라떼\nproductId: [1,2]"},
      {text: "input: 따뜻한 거 추천해줘"},
      {text: "output: 타겟팅: {categoryId:null, tagId:1, optionId:1, productId:null, recommened: null}\n검색결과: 아메리카노, 카페라떼\nproductId: [1,2]"},
      {text: "input: 달달한거 추천해줘"},
      {text: "output: 타겟팅: {categoryId:null, tagId:1, optionId:[4,5], productId:null, recommened: null\n}\n검색결과: 아메리카노, 카페라떼\nproductId: [1,2]"},
      {text: "input: 시원한거 추천해줘"},
      {text: "output: 타겟팅: {categoryId:null, tagId:1, optionId:2,  productId:null, recommened: null\n}\n검색결과: 아메리카노, 카페라떼\nproductId: [1,2]"},
      {text: "input: 차 추천해줘"},
      {text: "output: 타겟팅: {categoryId:3, tagId:null, optionId:null,  productId:null, recommened: null\n}\n검색결과: 보리차, 민트티\nproductId: [6,7]"},
      {text: "input: 에이드 추천해줘"},
      {text: "output: 타겟팅: {categoryId:2, tagId:null, optionId:null,  productId:null, recommened: null\n}\n검색결과: 레몬에이드, 복숭아에이드\nproductId: [4,5]"},
      {text: "input: 아메리카노 추천해줘"},
      {text: "output: 타겟팅: {categoryId:null, tagId:null, optionId:null,  productId: 1, recommened: null}\n검색결과: 아메리카노\nproductId: [1]"},
      //{text: "input: const Monthly_recommendedItems = [  {   name: '아메리카노',   id: 1,  },  {    name: '카페라떼',    id: 2,   },   {    name: '민트티',    id: 7,   }];"},
      {text: `input: 추천메뉴 테이블: ${JSON.stringify(Monthly_recommendedItems)}`},
      {text: "output: 타겟팅: {categoryId:null, tagId:null, optionId:null,  productId:null, recommened: [1,2,7]}\n검색결과: 아메리카노, 카페라떼, 민트티\nproductId: [1,2,7]"},
      {text: "input: 추천메뉴로 해줘"},
      {text: "output: 타겟팅: {categoryId:null, tagId:null, optionId:null, productId:null, recommened: [1,2,7]}\n검색결과: 아메리카노, 카페라떼, 민트티\nproductId: [1,2,7]"},
      {text: `input: ${userInput}`},
      {text: "output: "},
    ];


    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
    const result = await model.generateContent({
      contents: [{ role: "user", parts }],
      generationConfig,
      safetySettings,
    });

    const response = result.response;
    console.log("Response:", response);
    res.json({ message: response.text() });
  } catch (error) {
    console.error("Error communicating with Gemini API:", error);
    res.status(500).json({ message: "Failed to get response from server." });
  }
});


// 태그 목록 조회
app.get("/tags", async (req, res) => {
  try {
    console.log("태그 목록 조회 요청이 들어왔습니다.");
    // Oracle DB 연결
    const connection = await oracledb.getConnection(dbConfig);

    // 쿼리 실행
    const result = await connection.execute("SELECT * FROM product");

    // 연결 종료
    await connection.close();

    // 쿼리 결과 반환
    res.json(result.rows);
  } catch (error) {
    console.error("태그 목록 조회 중 오류 발생:", error);
    res.status(500).send("태그 목록 조회 중 오류가 발생했습니다.");
  }
});

// http 요청 들어오면 frontend/dist/index.html 제공
// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "frontend/dist/index.html"));
// });
app.get("/", (req, res) => {
  res.sendFile("test.html", { root: __dirname });
});

const jwtSecret = "mysecret key";

io.on("connection", (socket) => {
  console.log("A user connected");

  const clientId = socket.id;
  const client = new SpeechClient();
  const token = jwt.sign({ id: socket.id }, jwtSecret, { expiresIn: 60 * 60 });
  socket.emit("jwt", token);

  socket.on("logout", () => {
    socket.emit("logout");
    console.log("User logged out");
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });

  socket.on("chat message", (msg) => {
    console.log("Message: " + msg);
    io.emit("chat message", msg);
  });
});

// SpeechClient 인스턴스 생성
// 인증 파일 경로 설정
// JSON 파일의 경로를 환경 변수에서 가져옵니다.
const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;

// JSON 파일을 읽어와서 파싱합니다.
const credentials = JSON.parse(fs.readFileSync(credentialsPath));

// SpeechClient를 생성할 때 credentials를 사용합니다.
const client = new SpeechClient({ credentials });

app.post("/audio-upload", upload.single("uploaded_file"), async (req, res) => {
  let audioFilePath; // 변수를 try 블록 밖에서 선언합니다.

  // 현재 경로 + 파일 이름
  audioFilePath = req.body.uploaded_file;
  if (audioFilePath === undefined) {
    res
      .status(418)
      .json({ success: false, message: "파일이 업로드되지 않았습니다." });
    return;
  }

  audioFilePath = path.join(__dirname, "uploads", audioFilePath);
  console.log("audioFilePath:", audioFilePath);

  try {
    // 오디오 파일의 길이가 0인 경우 파일 처리 중단

    const fileData = fs.readFileSync(audioFilePath);
    if (fileData.length == 0) {
      res.status(418).json({ success: false, message: "파일이 비어있습니다." });
      return;
    }

    const config = {
      autoDecodingConfig: { encoding: "LINEAR16" },
      languageCodes: ["ko-KR"], // 한국어로 설정하세요
      model: "latest_short",
    };

    const request = {
      recognizer: `projects/${credentials.project_id}/locations/global/recognizers/_`,
      config: config,
      content: fileData,
    };

    const [response] = await client.recognize(request);

    const transcription = response.results
      .map((result) => result.alternatives[0].transcript)
      .join("\n");

    res.json({ success: true, message: "", data: transcription });
  } catch (error) {
    console.error("파일 처리 중 오류 발생:", error);
    res.json({ success: false, message: "파일 처리 중 오류가 발생했습니다." });
  } finally {
    if (audioFilePath) {
      fs.unlinkSync(audioFilePath); // 처리 후 파일 삭제
    }
  }
});

//오디오 녹음 받기
app.post("/upload", upload.single("audio"), (req, res) => {
  const audioFile = req.file;
  const tempPath = audioFile.path;
  const targetPath = `uploads/${audioFile.originalname}`;
  console.log("tempPath:", tempPath);
  console.log("targetPath:", targetPath);

  // make sure the 'uploads' directory exists
  fs.mkdir("uploads", { recursive: true }, (err) => {
    if (err) {
      console.error("Error creating directory:", err);
      return res.status(500).send("Error uploading file");
    }
  });

  fs.rename(tempPath, targetPath, (err) => {
    if (err) {
      console.error("Error moving file:", err);
      return res.status(500).send("Error uploading file");
    }
    const body = {
      uploaded_file: `${audioFile.originalname}`,
      text: "File uploaded successfully",
    };
    console.log(body);
    res.send(body);
  });
});

//결제
app.post("/payments/verify", async (req, res) => {
  const { imp_uid } = req.body; // 클라이언트로부터 전달받은 imp_uid
  const IMP_KEY = process.env.IMP_KEY; // REST API 키를 환경 변수에서 가져옵니다.
  console.log("imp_uid:", imp_uid);
  const IMP_SECRET = process.env.IMP_SECRET;
  console.log("IMP_KEY:", IMP_KEY);
  try {
    // 1. 아임포트 Access Token 획득
    const {
      data: {
        response: { access_token },
      },
    } = await axios.post("https://api.iamport.kr/users/getToken", {
      imp_key: IMP_KEY,
      imp_secret: IMP_SECRET,
    });

    // 2. 결제 정보 조회
    const {
      data: { response: paymentData },
    } = await axios.get(`https://api.iamport.kr/payments/${imp_uid}`, {
      headers: { Authorization: access_token },
    });

    // 3. 결제 상태 확인
    if (paymentData.status === "paid") {
      // 결제가 성공적으로 완료된 경우
      console.log("결제 성공");
      res.sendStatus(200);
    } else {
      // 결제가 성공적으로 처리되지 않은 경우
      res.status(400).send("결제가 완료되지 않았습니다.");
    }
  } catch (error) {
    console.error("결제 정보 검증 중 오류 발생:", error);
    res.status(500).send("결제 정보 검증 중 오류가 발생했습니다.");
  }
});

//DB에결제 정보 넣기
app.post("/payments/", async (req, res) => {

  try {
   
  } catch (error) {
    console.error("결제 정보 검증 중 오류 발생:", error);
    res.status(500).send("결제 정보 검증 중 오류가 발생했습니다.");
  }
});
// admin 로그인
app.post("/login/admin", (req, res) => {
  const { email, password } = req.body;
  if (email === "admin" && password === "admin") {
    const token = jwt.sign({ email: "admin" }, jwtSecret, { expiresIn: "1h" });
    res.json({ success: true, token, userID: 1 });
  } else {
    res.status(401).json({ success: false, message: "Invalid credentials" });
  }
});

//shop 로그인
app.post("/login/shop", (req, res) => {
  const { email, password } = req.body;
  if (email === "shop" && password === "shop") {
    const token = jwt.sign({ email: "shop" }, jwtSecret, { expiresIn: "1h" });
    res.json({ success: true, token, shopID: 1 });
  } else {
    res.status(401).json({ success: false, message: "Invalid credentials" });
  }
});

//db 연결
const categoryRouter = require("./dto/categorys.js");
app.use("/category", categoryRouter);

const tagRouter = require("./dto/tags.js");
app.use("/tag", tagRouter);


const kioskRouter = require("./dto/shopData.js");
app.use("/kiosk", kioskRouter);

//이미지 업로드
const uploadImage = require('./dto/imageUpload.js');
app.use('/image', uploadImage);
//---------------------------------------------------

const PORT = process.env.PORT || 3000; // 포트 번호 설정
  server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
