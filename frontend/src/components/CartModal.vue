<template>
  <div v-if="cart.length > 0">
    <v-row class="futter cart-container align-center shadow">
      <v-col cols="6" class="align-center" style="background-color: #ffffff">
        <v-row
          v-for="(item, index) in cart"
          :key="index"
          class="align-center ml-5"
          style="margin-left: 10%"
        >
          <p>{{ item.name }} - {{ parseInt(item.productPrice) }}원</p>
          <v-chip
            v-for="(option, optionIndex) in item.option"
            :key="optionIndex"
            class="ml-4"
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
      <v-col cols="1" class="shadow cart-fix-price">
        <p>{{ parseInt(totalPrice) }}원</p>
      </v-col>
      <v-col>
        <v-btn @click="handlePayment" class="shadow cart-fix-btn" height="20%">
          <v-icon left size="xx-large" style="margin-right: 10%"
            >bi-coin</v-icon
          >
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
    return {};
  },
  computed: {
    ...mapState(["cart", "totalPrice"]),
  },
  methods: {
    ...mapMutations(["subCart", "clearCart"]),
    removeFromCart(index) {
      this.subCart(index);
    },
    handlePayment() {
      if (this.totalPrice > 0) {
        this.$emit("payment", this.totalPrice);
        this.$router.push({ name: "PaymentPage" });
      } else {
        alert("장바구니가 비어 있습니다.");
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
