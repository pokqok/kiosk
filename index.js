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

const apiKey = process.env.OPENAI_API_KEY; // API Key in .env file for security
const apiURL = "https://api.openai.com/v1/chat/completions";

if (!apiKey) {
  console.error("API key is not set. Please check your .env file.");
  process.exit(1); // Exit if no API key is found
}

app.post("/chat", async (req, res) => {
  console.log("Chat request received");
  const userInput = req.body.userInput;
  const messages = [
    {
      role: "system",
      content:
        "너는 카페 키오스크의 메뉴 추천 기능을 가지고 있어, 너가 가진 메뉴는 아이스 아메리카노, 아이스 바닐라 라떼, 카라멜 마키아토, 그린 티 라떼, 에스프레소, 콜드 브루, 플랫 화이트, 모카 라떼, 마끼아토, 아이스 티, 토피넛 라떼, 버블티 이것 뿐이야 다른건 없어. 추가로 모든 메뉴는 차가운거 뜨거운거 다 있어",
    },
    {
      role: "user",
      content: `${userInput}에 대해 메뉴의 이름만 부탁해 답변에 죄송합니다를 하지마`,
    },
    {
      role: "assistant",
      content:
        '알맞는 답변이 없으면 없다고 말해줘. 멋대로 추천하지마. "죄송합니다." 라는 사과를 하지마.  질문에만 대답해 줘',
    },
  ];

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        temperature: 0.2,

        messages: messages,
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      }
    );
    res.json({ message: response.data.choices[0].message.content });
  } catch (error) {
    console.error("Error accessing OpenAI API:", error);
    res.status(500).send("Failed to fetch response from OpenAI API");
  }
});

// Vue.js 빌드 결과물을 제공하는 미들웨어 설정
// app.use(express.static(path.join(__dirname, "frontend/dist")));

/*
// Oracle DB 연결 정보
const dbConfig = {
    user: 'c##manager',//이름, 지금 오라클 21c 사용중, 근데 이름에 c##을 붙여야 함 왠진 모르겠지만
    password: '123456',
    connectString: 'SEHWANCOM:1521/xe' // Oracle 서버 주소
    //connectString: '0.0.0.0/xe' // Oracle 서버 주소
  };
*/

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

const PORT = process.env.PORT || 3000; // 포트 번호 설정
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
