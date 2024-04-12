const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const fs = require('fs');
const request = require('request');
const multer = require('multer');
const bodyParser = require('body-parser');
const path = require('path');
const jwt = require('jsonwebtoken');
const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const axios = require('axios');
const {SpeechClient} = require('@google-cloud/speech').v2;
const oracledb = require('oracledb');


app.use(express.static(__dirname)); // 정적 파일 제공을 위해 추가
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
var upload = multer({ dest: __dirname });

// CORS 설정
const cors = require('cors');
app.use(cors());

// Vue.js 빌드 결과물을 제공하는 미들웨어 설정
app.use(express.static(path.join(__dirname, 'frontend/dist')));

// Oracle DB 연결 정보
const dbConfig = {
    user: 'c##manager',//이름, 지금 오라클 21c 사용중, 근데 이름에 c##을 붙여야 함 왠진 모르겠지만
    password: '123456',
    connectString: 'SEHWANCOM:1521/xe' // Oracle 서버 주소
    //connectString: '0.0.0.0/xe' // Oracle 서버 주소
  };

// 태그 목록 조회
app.get('/tags', async (req, res) => {
  try {
    // Oracle DB 연결
    const connection = await oracledb.getConnection(dbConfig);
    
    // 쿼리 실행
    const result = await connection.execute('SELECT * FROM product');

    // 연결 종료
    await connection.close();

    // 쿼리 결과 반환
    res.json(result.rows);
  } catch (error) {
    console.error('태그 목록 조회 중 오류 발생:', error);
    res.status(500).send('태그 목록 조회 중 오류가 발생했습니다.');
  }
});


// http 요청 들어오면 frontend/dist/index.html 제공
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/dist/index.html'));
});
app.get('/', (req, res) => {
    res.sendFile('test.html', { root: __dirname });
});

const jwtSecret = 'mysecret key';

io.on('connection', (socket) => {
    console.log('A user connected');

    const clientId = socket.id;
    const client = new SpeechClient();
    const token = jwt.sign({ id: socket.id }, jwtSecret, { expiresIn: 60 * 60 });
    socket.emit('jwt', token);

    socket.on('logout', () => {
        socket.emit('logout');
        console.log('User logged out');
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });

    socket.on('chat message', (msg) => {
        console.log('Message: ' + msg);
        io.emit('chat message', msg);
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

app.post('/audio-upload', upload.single('uploaded_file'), async (req, res) => {
    let audioFilePath; // 변수를 try 블록 밖에서 선언합니다.


    // 현재 경로 + 파일 이름
    audioFilePath = req.body.uploaded_file;
    if (audioFilePath === undefined) {
        res.status(418).json({ success: false, message: "파일이 업로드되지 않았습니다." });
        return;
    }
      
    audioFilePath = path.join(__dirname, "uploads", audioFilePath);
    console.log('audioFilePath:', audioFilePath);
      
    try {
        // 오디오 파일의 길이가 0인 경우 파일 처리 중단

        const fileData = fs.readFileSync(audioFilePath);
        if (fileData.length == 0) {
            res.status(418).json({ success: false, message: "파일이 비어있습니다." });
            return;
        }
        
        const config = {
            autoDecodingConfig: { encoding: 'LINEAR16' },
            languageCodes: ['ko-KR'], // 한국어로 설정하세요
            model: 'latest_short',
        };

        const request = {
            recognizer: `projects/${credentials.project_id}/locations/global/recognizers/_`,
            config: config,
            content: fileData,
        };
        
        const [response] = await client.recognize(request);

        const transcription = response.results
            .map(result => result.alternatives[0].transcript)
            .join('\n');
        
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
app.post('/upload', upload.single('audio'), (req, res) => {
    const audioFile = req.file;
    const tempPath = audioFile.path;
    const targetPath = `uploads/${audioFile.originalname}`;
    console.log('tempPath:', tempPath);
    console.log('targetPath:', targetPath);
    

    // make sure the 'uploads' directory exists
    fs.mkdir('uploads', { recursive: true }, err => {
        if (err) {
            console.error('Error creating directory:', err);
            return res.status(500).send('Error uploading file');
        }
    });

    fs.rename(tempPath, targetPath, err => {
        if (err) {
            console.error('Error moving file:', err);
            return res.status(500).send('Error uploading file');
        }
        const body = {
            uploaded_file: `${audioFile.originalname}`,
            text:'File uploaded successfully'
        };
        console.log(body);
        res.send(body);
    });
});



//결제
app.post("/payments/verify", async (req, res) => {
    const { imp_uid } = req.body; // 클라이언트로부터 전달받은 imp_uid

    try {
        // 1. 아임포트 Access Token 획득
        const { data: { response: { access_token } } } = await axios.post("https://api.iamport.kr/users/getToken", {
            imp_key: "2380114616885334",
            imp_secret: "HOPSUHN0O3iTWQ30k26M6vcXE081OBblGD34gVQQ5sRMHahuI0jaunCDnbgypxcl9W4jrudKyHIoDW6y"
        });

        // 2. 결제 정보 조회
        const { data: { response: paymentData } } = await axios.get(`https://api.iamport.kr/payments/${imp_uid}`, {
            headers: { "Authorization": access_token }
        });

        // 3. 결제 상태 확인
        if (paymentData.status === 'paid') {
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
app.post('/login/admin', (req, res) => {
    const { email, password } = req.body;
    if (email === 'admin' && password === 'admin') {
        const token = jwt.sign({ email: 'admin' }, jwtSecret, { expiresIn: '1h' });
        res.json({ success: true, token, userID: 1 });
    } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
});

//shop 로그인
app.post('/login/shop', (req, res) => {
    const { email, password } = req.body;
    if (email === 'shop' && password === 'shop') {
        const token = jwt.sign({ email: 'shop' }, jwtSecret, { expiresIn: '1h' });
        res.json({ success: true, token, shopID: 1 });
    } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
});
const PORT = process.env.PORT || 3000; // 포트 번호 설정
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);

});


