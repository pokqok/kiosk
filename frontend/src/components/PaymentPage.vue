<template>
  <div>
    <div class="head-container">
      <v-row>
        <v-col cols="4">
          <audio
            ref="paymentAudio"
            :src="paymentAudioSource"
            type="audio/mp3"
          ></audio>
          <audio
            ref="paymentCompletedAudio"
            :src="paymentCompletedAudioSource"
            type="audio/mp3"
          ></audio>
          <audio
            ref="kakaoPayAudio"
            :src="kakaoPayAudioSource"
            type="audio/mp3"
          ></audio>
          <audio
            ref="normalPayAudio"
            :src="normalPayAudioSource"
            type="audio/mp3"
          ></audio>
          <audio
            ref="clickSound"
            :src="clickSoundSource"
            type="audio/mp3"
          ></audio>
          <v-btn color="white" @click="$router.go(-1 - 2 * cntCanclePay)">
            <v-icon left>mdi-arrow-left</v-icon>
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
            <span
              style="display: flex; flex-direction: column; align-items: center"
            >
              <i class="bi bi-credit-card pay-icon"></i>
              <h2 style="margin: 0">카드 결제</h2>
            </span>
          </v-btn>
        </v-col>
        <v-col cols="4">
          <v-btn @click="requestPayKakao" block height="150%">
            <span
              style="display: flex; flex-direction: column; align-items: center"
            >
              <i class="bi bi-chat-fill pay-icon"></i>
              <h2 style="margin: 0">카카오 페이</h2>
            </span>
          </v-btn>
        </v-col>
        <v-col cols="4">
          <v-btn @click="requestPayCash" block height="150%">
            <span
              style="display: flex; flex-direction: column; align-items: center"
            >
              <i class="bi bi-cash-stack pay-icon"></i>
              <h2 style="margin: 0">현금 결제</h2>
            </span>
          </v-btn>
        </v-col>
      </v-row>
    </v-container>

    <v-dialog v-model="showModal" max-width="500" persistent>
      <v-card class="square-modal">
        <v-card-title class="headline large-text">결제 완료</v-card-title>
        <v-card-text class="order-number-text"
          >주문번호: {{ orderNumber }}</v-card-text
        >
        <v-card-text class="animation-container">
          <div class="loader"></div>
        </v-card-text>
        <v-card-text class="info-text">
          잠시 후 모드 선택 창으로 돌아갑니다
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
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
      clickSoundSource: require("@/assets/click-sound.mp3"),
      showModal: false,
      orderNumber: null,
    };
  },
  computed: {
    ...mapState(["productName", "totalPrice", "cart", "orderCounter"]),
  },
  mounted() {
    this.IMP.init("imp03664607");
    this.playPaymentAudio();
  },
  methods: {
    ...mapMutations(["clearCart", "addCartToOrders", "incrementOrderCounter"]),
    playPaymentAudio() {
      this.resetAndPlay(this.$refs.paymentAudio);
    },
    playPaymentCompletedAudio() {
      this.resetAndPlay(this.$refs.paymentCompletedAudio);
    },
    playKakaoPayAudio() {
      this.resetAndPlay(this.$refs.kakaoPayAudio);
    },
    playNormalPayAudio() {
      this.resetAndPlay(this.$refs.normalPayAudio);
    },
    playClickSound() {
      this.resetAndPlay(this.$refs.clickSound);
    },

    stopAllAudio() {
      const audios = [
        this.$refs.paymentAudio,
        this.$refs.paymentCompletedAudio,
        this.$refs.kakaoPayAudio,
        this.$refs.normalPayAudio,
        this.$refs.clickSound,
      ];
      audios.forEach((audio) => {
        if (audio) {
          audio.pause();
          audio.currentTime = 0;
        }
      });
    },
    resetAndPlay(audio) {
      this.stopAllAudio();
      if (audio) {
        audio.currentTime = 0;
        audio.play().catch((error) => {
          console.error("Error playing audio:", error);
        });
      }
    },
    requestPay() {
      console.log("결제 시작 진입 성공 (여기서 totalPrice는:", this.totalPrice);
      console.log(
        "결제 시작 진입 성공 (결제하는 상품 이름은:",
        this.productName
      );
      this.playNormalPayAudio();
      const merchantUid = "merchant_" + new Date().getTime();
      this.IMP.request_pay(
        {
          pg: "html5_inicis.INIpayTest",
          merchant_uid: merchantUid,
          name: "실타래",
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
            this.handlePaymentSuccess(merchantUid);
          } else {
            alert(`결제에 실패하였습니다. 에러 내용: ${rsp.error_msg}`);
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
          name: "실타래",
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
            this.handlePaymentSuccess(merchantUid);
          } else {
            alert(`결제에 실패하였습니다. 에러 내용: ${rsp.error_msg}`);
            this.cntCanclePay++;
          }
        }
      );
    },
    requestPayCash() {
      const merchantUid = "merchant_" + new Date().getTime();
      this.handlePaymentPending(merchantUid);
    },
    handlePaymentPending(merchantUid) {
      this.$store.commit("addCartToOrders", { paymentMethod: "cash" });
      console.log("현재 주문 목록:", this.$store.state.orders);
      this.orderNumber = this.$store.state.orderCounter;
      this.showModal = true;
      this.startCountdown();
      this.savePaymentData(merchantUid, this.totalPrice);
      this.$store.commit("incrementOrderCounter");
      this.$store.commit("clearCart");
      console.log("Cart after clearCart:", this.$store.state.cart);
    },
    handlePaymentSuccess(merchantUid) {
      this.playPaymentCompletedAudio();
      this.$store.commit("addCartToOrders", { paymentMethod: "card" });
      console.log("현재 주문 목록:", this.$store.state.orders);
      this.orderNumber = this.$store.state.orderCounter;
      this.showModal = true;
      this.startCountdown();
      this.savePaymentData(merchantUid, this.totalPrice);
      this.$store.commit("incrementOrderCounter");
      this.$store.commit("clearCart");
      console.log("Cart after clearCart:", this.$store.state.cart);
    },
    startCountdown() {
      setTimeout(() => {
        this.showModal = false;
        this.$router.push("/mode-select");
      }, 5000);
    },
    savePaymentData(merchantUid, amount) {
      const paymentData = {
        merchantUid,
        amount,
        timestamp: new Date().toISOString(),
      };
      localStorage.setItem("paymentData", JSON.stringify(paymentData));
      console.log("Payment data saved to local storage:", paymentData);
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
  font-size: 48px;
  text-align: center;
}
.animation-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}
.loader {
  border: 16px solid #f3f3f3;
  border-radius: 50%;
  border-top: 16px solid #3498db;
  width: 120px;
  height: 120px;
  animation: spin 2s linear infinite;
}
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
.info-text {
  font-size: 24px;
  text-align: center;
  margin-top: 20px;
}
.v-overlay__scrim {
  background-color: rgba(0, 0, 0, 0.5) !important;
}
</style>
