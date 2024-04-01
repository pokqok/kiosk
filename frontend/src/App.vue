<template>
  <div>
    <!-- File Upload Form -->
    <form @submit.prevent="uploadFile">
      <div>
        <input type="file" name="uploaded_file" id="uploaded_file" @change="handleFileUpload">
        <input type="text" placeholder="Number of speakers" v-model="nspeakers">
        <button type="submit">Upload and Analyze</button>
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

    <!-- 상품 이름 입력 -->
    <input type="text" v-model="productName" placeholder="상품 이름">

    <!-- 상품 금액 입력 -->
    <input type="number" v-model="productAmount" placeholder="상품 금액">

    <!-- 결제하기 버튼 -->
    <button @click="requestPayKakao" :disabled="productAmount < 100">카카오페이</button>
    <button @click="requestPayToss" :disabled="productAmount < 100">토스페이</button>
    <button @click="requestPay" :disabled="productAmount < 100">일반결제</button>

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
      file: null, 
      numSpeakers: 0,
      resultText: '',
      showResult: false,
      IMP: window.IMP,
      productName: '', 
      productAmount: 0, 
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
    
    requestPayKakao() {
      if (this.productAmount < 100) {
        alert("결제 금액이 100원 미만입니다.");
        return; // 함수를 여기서 종료
      }
      const merchantUid = "merchant_" + new Date().getTime(); // Generate unique order number

      this.IMP.request_pay({
        pg: "html5_inicis.INIpayTest",
        pay_method: "kakaopay",
        merchant_uid: merchantUid,
        name: this.productName, 
        amount: this.productAmount, 
        buyer_email: "Iamport@chai.finance",
        buyer_name: "포트원 기술지원팀",
        buyer_tel: "010-1234-5678",
        buyer_addr: "서울특별시 강남구 삼성동",
        buyer_postcode: "123-456",
      }, rsp => {
        if (rsp.success) {
          console.log("성공");
          axios({
            url: "http://192.168.56.1:3000/payments/verify",
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

    requestPayToss() {
      if (this.productAmount < 100) {
        alert("결제 금액이 100원 미만입니다.");
        return; // 함수를 여기서 종료
      }
      const merchantUid = "merchant_" + new Date().getTime(); // Generate unique order number

      this.IMP.request_pay({
        pg: "html5_inicis.INIpayTest",
        pay_method: "tosspay",
        merchant_uid: merchantUid,
        name: this.productName, // 사용자가 입력한 상품 이름 사용
        amount: this.productAmount, // 사용자가 입력한 금액 사용
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

    requestPay() {
      if (this.productAmount < 100) {
        alert("결제 금액이 100원 미만입니다.");
        return; 
      }
      const merchantUid = "merchant_" + new Date().getTime(); // Generate unique order number

      this.IMP.request_pay({
        pg: "html5_inicis.INIpayTest",
        merchant_uid: merchantUid,
        name: this.productName, // 사용자가 입력한 상품 이름 사용
        amount: this.productAmount, // 사용자가 입력한 금액 사용
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
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  input[type="number"] {
    -moz-appearance: textfield;
  }


</style>
