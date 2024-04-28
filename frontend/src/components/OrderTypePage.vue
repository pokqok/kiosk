<template>
  <div class="head-container row">
    <h2 class="title">실타래 {{ $store.state.ShopID }}</h2>
  </div>

  <div style="margin-top: 10%"></div>

  <div class="col-12 p-3">
    <button
      type="button"
      class="btn btn-outline-success custom-btn"
      @click="goToShop('shop')"
    >
      <img :src="shopImage" alt="매장" style="width: 60px; height: 60px" />
      매장
      <img :src="shopImage" alt="매장" style="width: 60px; height: 60px" />
    </button>
  </div>
  <div class="col-12 p-3 mb-5">
    <button
      type="button"
      class="btn btn-outline-success custom-btn"
      @click="goToShop('Packaging')"
    >
      <img :src="packagingImage" alt="포장" style="width: 60px; height: 60px" />
      포장
      <img :src="packagingImage" alt="포장" style="width: 60px; height: 60px" />
    </button>
  </div>

  <button
    type="button"
    class="btn btn-outline-secondary rounded-pill btn-lg"
    @click="$router.go(-1)"
  >
    <i class="bi bi-arrow-90deg-left"></i>
  </button>
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

      this.$router.push("/shop/" + this.$store.state.ShopID);
    },
  },
};
</script>

<style></style>
