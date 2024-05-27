<template>
  <div class="head-container">
    <h2 class="title">실타래 {{ $store.state.ShopID }}</h2>
  </div>

  <div style="margin-top: 10%"></div>

  <v-container>
    <div>
      <audio ref="orderType" :src="orderTypeSource" type="audio/mp3"></audio>
      <v-btn @click="handleGoToShop('shop')" block class="pa-12">
        <i class="bi bi-shop" style="font-size: 2rem; margin-right: 10px"></i>
        매장
      </v-btn>
    </div>
    <div>
      <v-btn @click="handleGoToShop('Packaging')" block class="mt-10 pa-12">
        <i class="bi bi-bag" style="font-size: 2rem; margin-right: 10px"></i>
        포장
      </v-btn>
    </div>
  </v-container>

  <v-btn @click="handleGoToBack">
    <i class="bi bi-arrow-90deg-left"></i>
    <p class="ml-2">뒤로가기</p>
  </v-btn>
</template>

<script>
import clickSoundFile from "@/assets/click-sound.mp3";

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
    playClickSound() {
        const clickSound = new Audio(clickSoundFile);
        clickSound.play().catch((error) => {
          console.error("Error playing click sound:", error);
        });
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
    handleGoToShop(type) {
        this.playClickSound();
        this.goToShop(type);
      },
      handleGoToBack() {
        this.playClickSound();
        this.goToBack();
      },
  },
};
</script>

<!--이전 버전 코드, dev에서는 sound및 뒤로가기 버튼에 수정이 가해졌다.-->
<!-- <template>
  <div class="head-container row">
    <h2 class="title">실타래 {{ $store.state.ShopID }}</h2>
  </div>

  <div style="margin-top: 10%"></div>

  <v-container>
    <div>
      <audio ref="orderType" :src="orderTypeSource" type="audio/mp3"></audio>
      <v-btn @click="handleButtonClick('shop')" block class="pa-12">
        <i class="bi bi-shop" style="font-size: 2rem; margin-right: 10px"></i>
        매장
      </v-btn>
    </div>
    <div>
      <v-btn @click="handleButtonClick('Packaging')" block class="mt-10 pa-12">
        <i class="bi bi-bag" style="font-size: 2rem; margin-right: 10px"></i>
        포장
      </v-btn>
    </div>
  </v-container>

  <v-btn @click="handleBackButtonClick">
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
      this.resetAudio(this.$refs.orderType);
    },
    resetAudio(audio) {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    },
    goToShop(type) {
      this.stopAllAudio();
      if (type === "shop") {
        this.$store.commit("setOrderType", 0);
      } else if (type === "Packaging") {
        this.$store.commit("setOrderType", 1);
      }

      if (this.$route.params.mode === "common") {
        this.$router.push("/shop/" + this.$store.state.ShopID);
      } else if (this.$route.params.mode === "helper") {
        this.$router.push("/helper/" + this.$store.state.ShopID);
      }
    },
    goToBack() {
      this.$router.push("/mode-select");
    },
    handleButtonClick(type) {
      this.playClickSound();
      this.goToShop(type);
    },
    handleBackButtonClick() {
      this.playClickSound();
      this.goToBack();
    },
    playClickSound() {
      const clickSound = new Audio(require("@/assets/click-sound.mp3"));
      clickSound.play().catch((error) => {
        console.error("Error playing click sound:", error);
      });
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
</style> -->
