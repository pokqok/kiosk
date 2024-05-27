<template>
  <div class="head-container">
    <h2 class="title">실타래 {{ $store.state.ShopID }}</h2>
  </div>

  <div style="margin-top: 10%"></div>
  <audio ref="modeSelect" :src="modeSelectSource" type="audio/mp3"></audio>
  <v-container>
    <div>
      <!-- <v-btn @click="handleButtonClick('common')" block class="pa-12"> -->
      <v-btn @click="handleGoToNext('common')" block class="pa-12">
        <i
          class="bi bi-hand-index-thumb"
          style="font-size: 2rem; margin-right: 10px"
        ></i>
        일반 주문
      </v-btn>
    </div>
    <div>
      <!-- <v-btn @click="handleButtonClick('helper')" block class="mt-10 pa-12"> -->
        <v-btn @click="handleGoToNext('helper')" block class="mt-10 pa-12">
        <i class="bi bi-mic" style="font-size: 2rem; margin-right: 10px"></i>
        도우미 모드
      </v-btn>
    </div>
  </v-container>

  <!-- 미구현 -->
  <div class="d-flex align-center flex-column">
    <h5 style="margin-top: 10%">언어선택</h5>
    <v-btn-toggle
      v-model="Language"
      mandatory
      variant="outlined"
      rounded="xl"
    >
      <v-btn class="ma-0 my-1" size="large"> 한국어 </v-btn>
      <v-btn class="ma-0 my-1" size="large"> Eng </v-btn>
    </v-btn-toggle>
  </div>
</template>

<script>
 import clickSoundFile from "@/assets/click-sound.mp3";

export default {
  name: "ModeSelectPage",
  data() {
    return {
      Language: 0,
      modeSelectSource: require("@/assets/모드선택.mp3"),
    };
  },

  mounted() {
    this.playAudio();
  },

  methods: {
    goToNext(mode) {
      this.stopAllAudio();
      this.$router.push("/order-type/" + mode);
    },
    playAudio() {
      this.$refs.modeSelect.play();
    },
    stopAllAudio() {
      this.$refs.modeSelect.pause();
    },

    playClickSound() {
        const clickSound = new Audio(clickSoundFile);
        clickSound.play().catch((error) => {
          console.error("Error playing click sound:", error);
        });
      },

      handleGoToNext(mode) {
        this.playClickSound();
        this.goToNext(mode);
      },
  },

  // 로그인 정보 받아올 수 있을 때 사용
  // mounted() {
  //     if(this.$store.state.ShopID == -1) {
  //         alert("login error")
  //         this.$router.push('/login/shop')
  //     }
  // }
};
</script>

<!-- <style></style> -->
