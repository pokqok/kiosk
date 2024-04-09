<template>
  <RouterView @comeBack="showButton=true"></RouterView>
  <RouterLink to="/test"> <button v-if="showButton" @click="showButton = false">go Test</button> </RouterLink>
  <RouterLink to="/login/admin"> <button v-if="showButton" @click="showButton = false">go admin Login</button> </RouterLink>
  <RouterLink to="/login/shop"> <button v-if="showButton" @click="showButton = false">go shop Login</button> </RouterLink>
</template>

<script>

export default {
  name: 'App',
  data() {
    return {
      message: '',
      messages: [],
      file: null, // 파일 상태를 null로 초기화
      numSpeakers: 0,
      resultText: '',
      showResult: false,
      IMP: window.IMP,
      showTest: false,
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
    
    requestPay() {
      const merchantUid = "merchant_" + new Date().getTime(); // Generate unique order number

      this.IMP.request_pay({
        pg: "html5_inicis.INIpayTest",
        // pay_method: "kakaopay", 카카오페이만을 결제 수단으로 한다면 추가. 여러가지 존재 가능
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
            url: "/payments/verify", // ipconfig 이후 본인의 ipv4주소로 변경
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

    requestPayKakao() {
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
            url: "/payments/verify", // ipconfig 이후 본인의 ipv4주소로 변경
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
      const merchantUid = "merchant_" + new Date().getTime(); // Generate unique order number

      this.IMP.request_pay({
        pg: "html5_inicis.INIpayTest",
        pay_method: "tosspay", 
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
            url: "/payments/verify", // ipconfig 이후 본인의 ipv4주소로 변경
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