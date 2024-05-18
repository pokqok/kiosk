<template>
  <div>
  <v-row class="futter cart-container align-center shadow">
    <v-col cols="6" class="align-center" style="background-color: #ffffff">
      <v-row
        v-for="item in cart"
        :key="item"
        class="align-center"
        style="margin-left: 10%;"
      >
        <p>{{ item.productName }} - {{ item.productPrice }}원</p>
        <v-spacer></v-spacer>
        <v-btn          
          @click="$emit('subProduct', item)"
        >
          <v-icon>bi-x-lg</v-icon>
        </v-btn>
      </v-row>
    </v-col>
    <v-col cols="1" class="price-fixed shadow">
      <p>{{ parseInt(totalPrice) }}원</p>
    </v-col>
    <v-btn
      @click="$emit('payment', totalPrice)"
      class="btn-fixed shadow"
      width="30%"
      height="10%"
      style="margin-right: 5%;"
    >
      <v-icon left size="x-large" style="margin-right: 10%;">bi-coin</v-icon>
      <p> 결제</p>
    </v-btn>
  </v-row>
</div>

</template>

<script>
import { mapState } from "vuex";

export default {
  name: "CartModal",

  computed: {
    ...mapState(["cart", "totalPrice"]),
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
