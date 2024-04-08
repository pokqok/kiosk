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
const speech = require('@google-cloud/speech');


app.use(express.static(__dirname)); // 정적 파일 제공을 위해 추가
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
var upload = multer({ dest: __dirname });


// Vue.js 빌드 결과물을 제공하는 미들웨어 설정
app.use(express.static(path.join(__dirname, 'frontend/dist')));

// ETRI Open API 관련 설정
var openApiURL = 'http://aiopen.etri.re.kr:8000/WiseASR/Recognition';
var accessKey = '8356b229-c7b7-48ed-b085-be27df8632c7';
var languageCode = 'korean';


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


const client = new speech.SpeechClient();


app.post('/user', upload.single('uploaded_file'), async (req, res) => {
    let audioFilePath; // 변수를 try 블록 밖에서 선언합니다.

    try {
        audioFilePath = req.file.path; // 변수를 할당합니다.

        const config = {
            encoding: 'LINEAR16',
            sampleRateHertz: 16000,
            languageCode: 'ko-KR', // 한국어로 설정하세요
        };

        const audio = {
            content: fs.readFileSync(audioFilePath).toString('base64'),
        };

        const [response] = await client.recognize({ audio, config });
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


//이쪽에서 문제 발생
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

//오디오 녹음 받기
app.post('/upload', upload.single('audio'), (req, res) => {
    const audioFile = req.file;
    const tempPath = audioFile.path;
    const targetPath = `uploads/${audioFile.originalname}`;
  
    fs.rename(tempPath, targetPath, err => {
      if (err) {
        console.error('Error moving file:', err);
        return res.status(500).send('Error uploading file');
      }
      res.send('File uploaded successfully');
    });
  });

//로그인
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    if (email === 'admin' && password === 'admin') {
      const token = jwt.sign({ email: 'admin' }, jwtSecret, { expiresIn: '1h' });
      res.json({ success: true, token });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  });
const PORT = process.env.PORT || 3000; // 포트 번호 설정
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);

});
