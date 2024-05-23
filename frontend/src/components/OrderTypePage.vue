<template>
  <div class="head-container">
    <h2 class="title">실타래 {{ $store.state.ShopID }}</h2>
  </div>

  <div style="margin-top: 10%"></div>

  <v-container>
    <div>
      <audio ref="orderType" :src="orderTypeSource" type="audio/mp3"></audio>
      <v-btn @click="goToShop('shop')" block class="pa-12">
        <i class="bi bi-shop" style="font-size: 2rem; margin-right: 10px"></i>
        매장
      </v-btn>
    </div>
    <div>
      <v-btn @click="goToShop('Packaging')" block class="mt-10 pa-12">
        <i class="bi bi-bag" style="font-size: 2rem; margin-right: 10px"></i>
        포장
      </v-btn>
    </div>
  </v-container>

  <v-btn @click="goToBack">
    <i class="bi bi-arrow-90deg-left"></i>
  </v-btn>
</template>

<script>
export default {
  name: "OrderTypePage",
  mounted() {
    this.playAudio();
  },
  data() {
    return {
      shopImage: require("@/assets/inside.png"),
      packagingImage: require("@/assets/outside.png"),
      orderTypeSource: require("@/assets/매장또는포장.mp3"),
    };
  },
  methods: {
    playAudio() {
      this.$refs.orderType.play();
    },
    stopAllAudio() {
      this.$refs.orderType.pause();
    },
    goToShop(type) {
      if (type == "shop") {
        this.stopAllAudio();
        this.$store.commit("setOrderType", 0);
      } else if (type == "Packaging") {
        this.stopAllAudio();
        this.$store.commit("setOrderType", 1);
      }

      if (this.$route.params.mode == "common") {
        this.$router.push("/shop/" + this.$store.state.ShopID);
      } else if (this.$route.params.mode == "helper") {
        this.$router.push("/helper/" + this.$store.state.ShopID);
      }
    },
    goToBack() {
      this.$router.push("/mode-select");
    },
  },
};
</script>