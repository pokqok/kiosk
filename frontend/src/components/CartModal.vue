<template>
  <div v-if="cart.length > 0">
    <audio ref="subOrder" :src="subOrderSource" type="audio/mp3"></audio>
    <audio ref="clickSound" :src="clickSoundSource" type="audio/mp3"></audio>
    <v-row class="futter cart-container align-center shadow">
      <v-col cols="6" class="align-center" style="background-color: #ffffff">
        <v-row
          v-for="(item, index) in cart"
          :key="index"
          class="align-center ml-5"
          style="margin-left: 10%"
        >
          <p>{{ item.name }} - {{ parseInt(item.price) }}원</p>
          <!--{{ formatOptionsString(item.option) }} -->
          <v-chip
            v-for="(option, optionIndex) in item.option"
            :key="optionIndex"
            class="mx-2"
            outlined
          >
            {{ option.optionName }}
          </v-chip>
          <v-spacer></v-spacer>
          <v-btn @click="removeFromCart(index)">
            <v-icon>bi-x-lg</v-icon>
          </v-btn>
        </v-row>
      </v-col>
      <v-col cols="1" class="cart-fix-price shadow">
        <!-- store 및 shopPage에서의 전체 데이터 관리 형식이 바뀌어서 변형 필요-->
        <p>{{ parseInt(totalPrice) }}원</p>
      </v-col>
      <v-btn @click="handlePayment" class="shadow cart-fix-btn" height="20%">
        <v-icon left size="xx-large" style="margin-right: 10%">bi-coin</v-icon>
        <p>결제</p>
      </v-btn>
    </v-row>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";

export default {
  name: "CartModal",
  data() {
    return {
      subOrderSource: require("@/assets/장바구니취소.mp3"),
      clickSoundSource: require("@/assets/장바구니취소.mp3"),
    };
  },
  computed: {
    ...mapState(["cart", "totalPrice"]),
  },
  methods: {
    ...mapMutations(["subCart", "clearCart"]),
    removeFromCart(index) {
      this.playClickSound();
      const audio = this.$refs.subOrder;
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
        audio.play().catch((error) => {
          console.error("Error playing subOrder sound:", error);
        });
      }
      //이거 둘중 하나 뺴야할지 고민중
      this.subCart(index);
    },
    handlePayment() {
      this.playClickSound();
      if (this.totalPrice > 0) {
        this.$emit("payment", {
          num: this.cart.length,
          price: this.totalPrice,
          option: this.cart.option,
        });

        //dev에선 위에거 대신 이걸 이용
        // this.$emit("payment", this.totalPrice);
        // this.$router.push({ name: 'PaymentPage' });

        console.log("카트에서 결제함-결제금액: ", this.totalPrice);
        //clean Cart는 shopPage로 이동했다.
      } else {
        alert("장바구니가 비어 있습니다.");
      }
    },
    playClickSound() {
      const clickSound = this.$refs.clickSound;
      if (clickSound) {
        clickSound.pause();
        clickSound.currentTime = 0;
        clickSound.play().catch((error) => {
          console.error("Error playing click sound:", error);
        });
      }
    },
    formatOptionsString(optionsArray) {
      //options를 받아서 문자열로 변환
      //console.log(optionsArray)
      if (!optionsArray || optionsArray.length == 0) return "";
      return (
        "(" +
        optionsArray
          .map((option) => `${option.tagName}:${option.optionName}`)
          .join(", ") +
        ")"
      );
    },
  },
  watch: {
    cart(newCart) {
      if (newCart.length === 0) {
        this.$emit("hideCartModal");
      }
    },
  },
};
</script>

<!-- <style>
.cart-container {
  background-color: #f8f9fa;
  height: 25%;
  overflow-y: auto;
}

.btn-fixed {
  position: fixed;
  right: 2vw;
}

.price-fixed {
  position: fixed;
  right: 40vw;
  padding: 10px;
  border-radius: 5px;
}

.shadow {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
</style> -->

