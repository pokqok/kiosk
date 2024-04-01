<template>
  <div>
    <!-- File Upload Form -->
    <form @submit.prevent="uploadFile">
      <div>
        <input type="file" name="uploaded_file" id="uploaded_file" @change="handleFileUpload">
        <input type="text" placeholder="Number of speakers" v-model="nspeakers">
        <button type="submit">Upload and Analyze</button>
        <AudioRecord/>
      </div>
    </form>

    <!-- Messages List -->
    <ul>
      <li v-for="msg in messages" :key="msg">{{ msg }}</li>
    </ul>
    <!-- Message Input and Send Button -->
    <input v-model="message" autocomplete="off">
    <button @click="sendMessage">Send</button>

    <!-- Recognition Result Display -->
    <div v-if="showResult" style="margin-top: 20px; padding: 10px; background-color: #f0f0f0; border-radius: 5px;">
      <span>{{ resultText }}</span>
    </div>

    <!-- Payment Button -->
    <button @click="requestPay">결제하기</button>
  </div>
</template>

<script>
import io from 'socket.io-client';
import axios from 'axios';
import AudioRecord from './components/record.vue';

export default {
  name: 'App',

  components: {
    AudioRecord
  },

  data() {
    return {
      message: '',
      messages: [],
      file: null, // 파일 상태를 null로 초기화
      numSpeakers: 0,
      resultText: '',
      showResult: false,
      IMP: window.IMP,
    };
  },

  mounted() {
    this.initSocket();
    this.IMP.init("imp03664607");
  },

  methods: {
    initSocket() {
      const socket = io();

      socket.on('jwt', function (token) {
        sessionStorage.setItem('jwt', token);
      });

      socket.on('chat message', (msg) => {
        this.messages.push(msg);
        window.scrollTo(0, document.body.scrollHeight);
      });

      this.socket = socket;
    },
    
    requestPay() {
      const merchantUid = "merchant_" + new Date().getTime(); // Generate unique order number

      this.IMP.request_pay({
        pg: "html5_inicis.INIpayTest",
        // pay_method: "kakaopay", 카카오페이만을 결제 수단으로 한다면 추가. 여러가지 존재 가능
        merchant_uid: merchantUid,
        name: "제발 되라",
        amount: 100,
        buyer_email: "Iamport@chai.finance",
        buyer_name: "포트원 기술지원팀",
        buyer_tel: "010-1234-5678",
        buyer_addr: "서울특별시 강남구 삼성동",
        buyer_postcode: "123-456",
      }, rsp => {
        if (rsp.success) {
          console.log("성공");
          axios({
            url: "http://192.168.56.1:3000/payments/verify", // ipconfig 이후 본인의 ipv4주소로 변경
            method: "post",
            headers: { "Content-Type": "application/json" },
            data: {
              imp_uid: rsp.imp_uid,
              merchant_uid: rsp.merchant_uid
            }
          }).then(() => {
            console.log("성공");
            alert("결제가 완료되었습니다.");
          })
        } else {
          alert(`결제에 실패하였습니다. 에러 내용: ${rsp.error_msg}`);
        }
      });
    },

    sendMessage() {
      if (this.message === '') return;
      this.socket.emit('chat message', this.message);
      this.message = ''; // Clear the input after sending
    },

    handleFileUpload(event) {
      this.file = event.target.files[0];
    },

    uploadFile() {
      const formData = new FormData();
      formData.append('uploaded_file', this.file);
      formData.append('nspeakers', this.nspeakers);

      fetch('/user', {
        method: 'POST',
        body: formData,
      })
        .then(response => response.json())
        .then(data => {
          this.resultText = data.success ? data.data : 'Error processing file.';
          this.showResult = true;
        })
        .catch(error => {
          console.error('Error:', error);
          this.resultText = 'Error submitting the form.';
          this.showResult = true;
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