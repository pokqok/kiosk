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
      <v-btn icon class="ml-2" @click="dialogCommon = true">
        <v-icon>mdi-help-circle</v-icon>
      </v-btn>
    </div>
    <div>
      <!-- <v-btn @click="handleButtonClick('helper')" block class="mt-10 pa-12"> -->
      <v-btn @click="handleGoToNext('helper')" block class="mt-10 pa-12">
        <i class="bi bi-mic" style="font-size: 2rem; margin-right: 10px"></i>
        도우미 모드
      </v-btn>
      <v-btn icon class="ml-2" @click="dialogHelper = true">
        <v-icon>mdi-help-circle</v-icon>
      </v-btn>
    </div>
  </v-container>

  <!-- 미구현 -->
  <div class="d-flex align-center flex-column">

    <!--<h5 style="margin-top: 10%">언어선택</h5>
    
    <v-btn-toggle
      v-model="Language"
      mandatory
      variant="outlined"
      rounded="xl"
    >
    
      <v-btn class="ma-0 my-1" size="large"> 한국어 </v-btn>
      <v-btn class="ma-0 my-1" size="large"> Eng </v-btn>
    </v-btn-toggle>
    -->
  </div>

  <v-dialog v-model="dialogCommon" max-width="400px">
    <v-card>
      <v-card-title class="headline">일반 모드란?</v-card-title>
      <v-card-text>
        일반 모드는 키오스크 방식에 익숙한 사용자들을 위한 모드로, 카테고리별로
        메뉴가 나뉘어져 있습니다.
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="dialogCommon = false"
          >닫기</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog v-model="dialogHelper" max-width="400px">
    <v-card>
      <v-card-title class="headline">도우미 모드란?</v-card-title>
      <v-card-text>
        도우미 모드는 음성으로 주문하는 방식으로, 키오스크 사용에 어려움이
        있거나 메뉴 선택에 어려움이 있는 사용자들을 위한 모드입니다.
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="dialogHelper = false"
          >닫기</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import clickSoundFile from "@/assets/click-sound.mp3";

export default {
  name: "ModeSelectPage",
  data() {
    return {
      Language: 0,
      modeSelectSource: require("@/assets/모드선택.mp3"),
      dialogCommon: false,
      dialogHelper: false,
    };
  },

  mounted() {
    this.playAudio();
  },

  methods: {
    goToNext(mode) {
      this.stopAllAudio;
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
};

</script>

<!-- <style></style> -->
