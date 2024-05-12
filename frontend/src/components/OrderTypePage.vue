<template>
  <div class="head-container row">
    <h2 class="title">실타래 {{ $store.state.ShopID }}</h2>
  </div>

  <div style="margin-top: 10%"></div>

  <v-container>
    <div>
      <v-btn
        @click="goToShop('shop')"
        block
        class="pa-12"
      >
      <i class="bi bi-shop" style="font-size: 2rem; margin-right: 10px;"></i>
      매장
      </v-btn>
    </div>
    <div>
      <v-btn
      @click="goToShop('Packaging')"
        block
        class="mt-10 pa-12"
      >
      <i class="bi bi-bag" style="font-size: 2rem; margin-right: 10px;"></i>
      포장
      </v-btn>
    </div>
  </v-container>

  <v-btn
    @click="$router.go(-1)"
  >
    <i class="bi bi-arrow-90deg-left"></i>
  </v-btn>
</template>

<script>
export default {
  name: "OrderTypePage",
  data() {
    return {
      shopImage: require("@/assets/inside.png"),
      packagingImage: require("@/assets/outside.png"),
    };
  },
  methods: {
    goToShop(type) {
      if (type == "shop") {
        this.$store.commit("setOrderType", 0);
      } else if (type == "Packaging") {
        this.$store.commit("setOrderType", 1);
      }

      if(this.$route.params.mode == 'common') {
        this.$router.push("/shop/" + this.$store.state.ShopID);
      } else if(this.$route.params.mode == 'helper') {
        this.$router.push("/helper/" + this.$store.state.ShopID);
      }
    },
  },
};
</script>

<style></style>
