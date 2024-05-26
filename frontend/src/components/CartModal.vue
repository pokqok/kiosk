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
          <p>{{ item.name }} - {{ parseInt(item.productPrice) }}원 </p>
          <v-chip v-for="(option, optionIndex) in item.option" :key="optionIndex" class="ml-4" outlined>
            {{ option.optionName }}
          </v-chip>
          <v-spacer></v-spacer>
          <v-btn @click="removeFromCart(index)">
            <v-icon>bi-x-lg</v-icon>
          </v-btn>
        </v-row>
      </v-col>
      <v-col cols="1" class="shadow cart-fix-price">
        <p>{{ parseInt(totalPrice) }}원</p>
      </v-col>
      <v-col>
        <v-btn
          @click="handlePayment"
          class="shadow cart-fix-btn"
          height="20%"
        >
          <v-icon left size="xx-large" style="margin-right: 10%">bi-coin</v-icon>
          <h2>결제</h2>
        </v-btn>
      </v-col>
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
        audio.play().catch(error => {
          console.error("Error playing subOrder sound:", error);
        });
      }
      this.subCart(index);
    },
    handlePayment() {
      this.playClickSound();
      if (this.totalPrice > 0) {
        this.$emit("payment", {num: this.cart.length, price: this.totalPrice, option: this.cart.option});
        //그래서 형식이 어떻게 된 건지는 잘 몰라서 일단 대충 넣어둠
        console.log("카트에서 결제함-결제금액: ", this.totalPrice);
        //this.clearCart(); 해당 clean Cart는 shopPage로 이동했다.
      } else {
        alert("장바구니가 비어 있습니다.");
      }
    },
    playClickSound() {
      const clickSound = this.$refs.clickSound;
      if (clickSound) {
        clickSound.pause();
        clickSound.currentTime = 0;
        clickSound.play().catch(error => {
          console.error("Error playing click sound:", error);
        });
      }
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