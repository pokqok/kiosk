<template>
  <div>
    <!-- Form for file upload and number of speakers -->
    <form @submit.prevent="uploadFile" enctype="multipart/form-data">
      <div class="form-group">
        <input type="file" class="form-control-file" @change="handleFileUpload" ref="file">
        <input type="text" class="form-control" placeholder="Number of speakers" v-model="numSpeakers">
        <button type="submit" class="btn btn-default">Get me the stats!</button>
      </div>
    </form>

    <!-- Real-time chat interface -->
    <ul>
      <li v-for="msg in messages" :key="msg">{{ msg }}</li>
    </ul>
    <input v-model="message" autocomplete="off">
    <button @click="sendMessage">Send</button>
  </div>
</template>

<script>
import io from 'socket.io-client';
import axios from 'axios';

export default {
  name: 'App',

  data() {
    return {
      message: '',
      messages: [],
      file: null, // 파일 상태를 null로 초기화
      numSpeakers: 0
    };
  },

  mounted() {
    this.initSocket();
  },
  
  methods: {
    initSocket() {
      const socket = io();

      socket.on('chat message', (msg) => {
        this.messages.push(msg);
        window.scrollTo(0, document.body.scrollHeight);
      });

      this.socket = socket;
    },

    sendMessage() {
      this.socket.emit('chat message', this.message);
      this.message = ''; // Clear the input after sending
    },

    handleFileUpload(event) {
      this.file = event.target.files[0];
    },

    uploadFile() {
      const formData = new FormData();
      formData.append('uploaded_file', this.file);
      formData.append('nspeakers', this.numSpeakers);

      // axios로 업로드 test
      axios.post('/user', formData)
      .then((response) => {
        // 성공
        // kiosk 폴더 내에 전송한 파일 생성, 그러나 확장자가 안붙어 있기 때문에 전송한 파일 확장자를 붙여줘야 함
        console.log(response.data);
      }).catch((error) => {
        // 실패
        console.error("File upload error:", error);
      });
    }
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
