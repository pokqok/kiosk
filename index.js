const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const fs = require('fs');
const request = require('request');
const multer = require('multer');
const bodyParser = require('body-parser');
const path = require('path');
const exp = require("constants");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// bodyParser와 multer를 사용한 설정
app.use(bodyParser.urlencoded({extended:false}));
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

io.on('connection', (socket) => {
  console.log('A user connected');
  
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
  
  socket.on('chat message', (msg) => {
    console.log('Message: ' + msg);
    io.emit('chat message', msg);
  });
});

app.post('/user', upload.single('uploaded_file'), function (req, res){
    var audioFilePath = req.file.path;
    var audioData = fs.readFileSync(audioFilePath);   

    var requestJson = {
        'argument': {
            'language_code': languageCode,
            'audio': audioData.toString('base64')
        }
    };

    var options = {
        url: openApiURL,
        body: JSON.stringify(requestJson),
        headers: {'Content-Type':'application/json','Authorization':accessKey}
    };

    request.post(options, function (error, response, body) {
        if(!error){
            let json = JSON.parse(body);
            res.status(200).send(json.return_object.recognized);
            fs.unlink(req.file.path, function(err){
                if(err) {
                    console.log("Error : ", err)
                }
            })
        }
    });
});

const PORT = process.env.PORT || 3000; // 포트 번호 설정
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
