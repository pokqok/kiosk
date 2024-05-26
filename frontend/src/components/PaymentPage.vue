<template>
  <div>
    <div class="head-container">
      <v-row>
        <v-col cols="4">
          <audio ref="paymentAudio" :src="paymentAudioSource" type="audio/mp3"></audio>
          <audio ref="paymentCompletedAudio" :src="paymentCompletedAudioSource" type="audio/mp3"></audio>
          <audio ref="kakaoPayAudio" :src="kakaoPayAudioSource" type="audio/mp3"></audio>
          <audio ref="normalPayAudio" :src="normalPayAudioSource" type="audio/mp3"></audio>
          <v-btn @click="$router.go(-1 - 2 * cntCanclePay)" style="background-color: #009688">
            <i class="bi bi-x-lg icon"></i>
            <p>취소</p>
          </v-btn>
        </v-col>
        <v-col cols="4">
          <h2 class="title col-4">결제 방법 선택</h2>
        </v-col>
      </v-row>
    </div>

    <v-container>
      <v-row style="margin-top: 12%">
        <v-col cols="4">
          <v-btn @click="requestPay" block height="150%">
            <span style="display: flex; flex-direction: column; align-items: center">
              <i class="bi bi-credit-card pay-icon"></i>
              <h2 style="margin: 0">카드 결제</h2>
            </span>
          </v-btn>
        </v-col>
        <v-col cols="4">
          <v-btn @click="requestPayKakao" block height="150%">
            <span style="display: flex; flex-direction: column; align-items: center">
              <i class="bi bi-chat-fill pay-icon"></i>
              <h2 style="margin: 0">카카오 페이</h2>
            </span>
          </v-btn>
        </v-col>
      </v-row>
    </v-container>

    <v-dialog v-model="showModal" max-width="500">
      <v-card class="square-modal">
        <v-card-title class="headline large-text">결제 완료</v-card-title>
        <v-card-text class="order-number-text">주문번호: {{ orderNumber }}</v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import axios from "axios";
import { mapState, mapMutations } from "vuex";

export default {
  name: "PaymentPage",

  data() {
    return {
      IMP: window.IMP,
      cntCanclePay: 0,
      paymentAudioSource: require("@/assets/결제 방법 선택.mp3"),
      paymentCompletedAudioSource: require("@/assets/결제 완료.mp3"),
      kakaoPayAudioSource: require("@/assets/카카오페이.mp3"),
      normalPayAudioSource: require("@/assets/일반결제.mp3"),
      showModal: false, // 모달 표시 여부
      orderNumber: null, // 주문번호
    };
  },

  computed: {
    ...mapState(["productName", "totalPrice", "cart", "orderCounter"]),
  },

  mounted() {
    if (this.$store.state.ShopID == -1) {
      alert("login error");
      this.$router.push('/login/shop');
      return;
    }

    this.IMP.init("imp03664607");
    this.playPaymentAudio();
  },

  methods: {
    ...mapMutations([
      "clearCart",
    ]),

    playPaymentAudio() {
      this.$refs.paymentAudio.play();
    },
    playPaymentCompletedAudio() {
      this.$refs.paymentCompletedAudio.play();
    },
    playKakaoPayAudio() {
      this.$refs.kakaoPayAudio.play();
    },
    playNormalPayAudio() {
      this.$refs.normalPayAudio.play();
    },
    stopAllAudio() {
      this.$refs.paymentAudio.pause();
      this.$refs.paymentCompletedAudio.pause();
      this.$refs.kakaoPayAudio.pause();
      this.$refs.normalPayAudio.pause();
    },

    requestPay() {
      console.log("결제 시작 진입 성공 (여기서 totalPrice는:",this.totalPrice)
      console.log("결제 시작 진입 성공 (결제하는 상품 이름은 :",this.productName)
      this.playNormalPayAudio();
      const price = this.totalPrice;
      const merchantUid = "merchant_" + new Date().getTime();
      this.IMP.request_pay(
        {
          pg: "html5_inicis.INIpayTest",
          merchant_uid: merchantUid,
          name: this.productName,
          goodsname: this.productName,
          amount: this.totalPrice,
          buyer_email: "Iamport@chai.finance",
          buyer_name: "포트원 기술지원팀",
          buyer_tel: "010-1234-5678",
          buyer_addr: "서울특별시 강남구 삼성동",
          buyer_postcode: "123-456",
        },
        (rsp) => {
          if (rsp.success) {
            axios
              .post("api/payments/verify", {
                imp_uid: rsp.imp_uid,
                merchant_uid: rsp.merchant_uid,
              })
              .then((verifyResponse) => {
                if (verifyResponse.status === 200) {
                  this.playPaymentCompletedAudio();
                  this.savePaymentData(merchantUid, this.totalPrice);
                  alert("결제가 완료되었습니다.");
                  setTimeout(() => {
                    this.$router.push("/mode-select");
                  }, 5000);
                } else {
                  alert("결제 검증 실패");
                }
              });
              this.clearCart();
          } else {
            alert(`결제에 실패하였습니다. 에러 내용: ${rsp.error_msg}`);
            console.log("총 결제 내역은:",price);
            this.$store.commit("decrementOrderCounter");
            this.cntCanclePay++;
          }
        }
      );
    },

    requestPayKakao() {
      this.playKakaoPayAudio();
      const merchantUid = "merchant_" + new Date().getTime();
      this.IMP.request_pay(
        {
          pg: "html5_inicis.INIpayTest",
          pay_method: "kakaopay",
          merchant_uid: merchantUid,
          name: this.productName,
          goodsname: this.productName,
          amount: this.totalPrice,
          buyer_email: "Iamport@chai.finance",
          buyer_name: "포트원 기술지원팀",
          buyer_tel: "010-1234-5678",
          buyer_addr: "서울특별시 강남구 삼성동",
          buyer_postcode: "123-456",
        },
        (rsp) => {
          if (rsp.success) {
            axios({
              url: "api/payments/verify",
              method: "post",
              headers: { "Content-Type": "application/json" },
              data: {
                imp_uid: rsp.imp_uid,
                merchant_uid: rsp.merchant_uid,
              },
            })
              .then(() => {
                this.playPaymentCompletedAudio();
                this.savePaymentData(merchantUid, this.totalPrice);
                alert("결제가 완료되었습니다.");
                this.$store.commit("incrementOrderCounter");
                this.$store.commit("clearCart");
                setTimeout(() => {
                  this.$router.push("/mode-select");
                }, 5000);
              })
              .catch((error) => {
                console.error("Error verifying payment:", error);
                alert(`결제 검증 실패: ${error.message}`);
                this.$store.commit("decrementOrderCounter");
                this.cntCanclePay++;
              });
              this.clearCart();
          } else {
            alert(`결제에 실패하였습니다. 에러 내용: ${rsp.error_msg}`);
            this.cntCanclePay++;
          }
        }
      );
    },

    handlePaymentSuccess(merchantUid) {
      this.playPaymentCompletedAudio();

      // Vuex 뮤테이션 호출하여 cart 내용을 orders에 추가
      this.$store.commit("addCartToOrders");
      console.log("현재 주문 목록:", this.$store.state.orders);

      // 주문번호 설정
      this.orderNumber = this.$store.state.orderCounter; // store의 orderCounter로 설정

      // 모달 표시
      this.showModal = true;

      // 결제 데이터를 저장
      this.savePaymentData(merchantUid, this.totalPrice);

      // 카트 비우기
      this.$store.commit("clearCart");
      console.log('Cart after clearCart:', this.$store.state.cart); // clearCart 후 cart 출력

      // 5초 후 모드 선택 페이지로 이동
      setTimeout(() => {
        this.showModal = false;
        console.log("모드 선택 페이지로 이동합니다.");
        this.$router.push("/mode-select");
      }, 5000);
    },

    savePaymentData(merchantUid, totalPrice) {
      console.log("Payment data saved successfully:", {
        merchant_uid: merchantUid,
        total_price: totalPrice,
      });
    },
  },
};
</script>

<style>
.head-container {
  position: fixed;
  top: 0;
  width: 100%;
  background-color: #229954;
  padding: 10px 0;
  z-index: 100;
}

.title {
  color: white;
  text-align: center;
  font-weight: bold;
  margin: 0;
}

.pay-icon {
  font-size: 150px;
}

.square-modal {
  width: 500px;
  height: 500px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.large-text {
  font-size: 36px;
  text-align: center;
}

.order-number-text {
  font-size: 48px; /* 주문번호 글자 크기를 더 크게 설정 */
  text-align: center;
}

.v-card-title, .v-card-text {
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
}
</style>
