const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const fs = require('fs');
const request = require('request');
const multer = require('multer');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(__dirname)); // 정적 파일 제공을 위해 추가
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
var upload = multer({ dest: __dirname });

var openApiURL = 'http://aiopen.etri.re.kr:8000/WiseASR/Recognition';
var accessKey = '8356b229-c7b7-48ed-b085-be27df8632c7';
var languageCode = 'korean';

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

app.post('/user', upload.single('uploaded_file'), function (req, res) {
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
    headers: { 'Content-Type': 'application/json', 'Authorization': accessKey }
  };

  request.post(options, function (error, response, body) {
    if (!error) {
      let json = JSON.parse(body);
      res.json({ success: true, message: "", data: json.return_object.recognized });
    } else {
      res.json({ success: false, message: "Error processing file." });
    }
    fs.unlinkSync(audioFilePath); // Ensure the file is deleted after processing
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});



