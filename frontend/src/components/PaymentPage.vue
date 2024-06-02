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
          <audio
            ref="cashPaymentAudio"
            :src="cashPaymentAudioSource"
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

    <v-dialog v-model="showModal" max-width="500">
      <v-card class="square-modal">
        <v-card-title class="headline large-text">결제 완료</v-card-title>
        <v-card-text class="order-number-text"
          >주문번호: {{ orderNumber }}</v-card-text
        >
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
      //cashPaymentAudioSource: require("@/assets/현금주문.mp3"),
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
    ...mapMutations(["clearCart", "addCartToOrders"]),
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
    playCashPaymentAudio() {
      this.resetAndPlay(this.$refs.cashPaymentAudio);
    },
    stopAllAudio() {
      const audios = [
        this.$refs.paymentAudio,
        this.$refs.paymentCompletedAudio,
        this.$refs.kakaoPayAudio,
        this.$refs.normalPayAudio,
        this.$refs.clickSound,
        this.$refs.cashPaymentAudio,
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
        "결제 시작 진입 성공 (결제하는 상품 이름은 :",
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
      //this.playCashPaymentAudio();
      const merchantUid = "merchant_" + new Date().getTime();
      // Handle cash payment without IMP.request_pay
      this.handlePaymentPending(merchantUid);
    },
    handlePaymentPending(merchantUid) {
      this.$store.commit("addCartToOrders", { paymentMethod: "cash" });
      console.log("현재 주문 목록:", this.$store.state.orders);
      this.orderNumber = this.$store.state.orderCounter;
      this.showModal = true;
      this.savePaymentData(merchantUid, this.totalPrice);
      this.$store.commit("incrementOrderCounter");
      this.$store.commit("clearCart");
      console.log("Cart after clearCart:", this.$store.state.cart);
      setTimeout(() => {
        this.showModal = false;
        console.log("모드 선택 페이지로 이동합니다.");
        this.$router.push("/mode-select");
      }, 5000);
    },
    handlePaymentSuccess(merchantUid) {
      this.playPaymentCompletedAudio();
      this.$store.commit("addCartToOrders", { paymentMethod: "card" });
      console.log("현재 주문 목록:", this.$store.state.orders);
      this.orderNumber = this.$store.state.orderCounter;
      this.showModal = true;
      this.savePaymentData(merchantUid, this.totalPrice);
      this.$store.commit("incrementOrderCounter");
      this.$store.commit("clearCart");
      console.log("Cart after clearCart:", this.$store.state.cart);
      setTimeout(() => {
        this.showModal = false;
        console.log("모드 선택 페이지로 이동합니다.");
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
</style>
