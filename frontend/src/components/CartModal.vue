<template>
  <div>
    <audio ref="subOrder" :src="subOrderSource" type="audio/mp3"></audio>
    <audio ref="clickSound" :src="clickSoundSource" type="audio/mp3"></audio>
    <v-row class="futter cart-container align-center shadow">
      <v-col cols="6" class="align-center" style="background-color: #ffffff">
        <v-row
          v-for="(item, index) in cart"
          :key="index"
          class="align-center"
          style="margin-left: 10%"
        >
          <p>{{ item.name }} - {{ item.productPrice }}원</p>
          <v-spacer></v-spacer>
          <v-btn @click="removeFromCart(index)">
            <v-icon>bi-x-lg</v-icon>
          </v-btn>
        </v-row>
      </v-col>
      <v-col cols="1" class="price-fixed shadow">
        <p>{{ parseInt(totalPrice) }}원</p>
      </v-col>
      <v-btn
        @click="handlePayment"
        class="btn-fixed shadow"
        width="30%"
        height="10%"
        style="margin-right: 5%"
      >
        <v-icon left size="x-large" style="margin-right: 10%">bi-coin</v-icon>
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
      clickSoundSource: require("@/assets/click-sound.mp3"),
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
      audio.pause();
      audio.currentTime = 0;
      audio.play();
      this.subCart(index);
    },
    handlePayment() {
      this.playClickSound();
      console.log("handlePayment");
      if (this.totalPrice > 0) {
        this.$emit("payment", this.totalPrice);
        console.log("결제금액: ", this.totalPrice);
        this.clearCart();
      } else {
        alert("장바구니가 비어 있습니다.");
      }
    },
    playClickSound() {
      const clickSound = this.$refs.clickSound;
      clickSound.pause();
      clickSound.currentTime = 0;
      clickSound.play().catch((error) => {
        console.error("Error playing click sound:", error);
      });
    },
  },
};
</script>

<style>
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
</style>
