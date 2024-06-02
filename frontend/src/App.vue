<template>
  <v-app>
    <v-main>
      <div class="font-size-buttons">
        <button @click="increaseFontSize">+</button>
        <button @click="decreaseFontSize">-</button>
      </div>
      <RouterView @comeBack="showButton = true"></RouterView>
      <RouterLink to="/login/admin">
      
        <!-- <button v-if="showButton" @click="showButton = false"> -->
        <button v-if="showButton" @click="handleButtonClick">

          관리자 로그인
        </button>
      </RouterLink>
      <RouterLink to="/login/shop">
        <!-- <button v-if="showButton" @click="showButton = false"> -->
        <button v-if="showButton" @click="handleButtonClick">

          상점 로그인
        </button>
      </RouterLink>
      <!-- 나중에 쓸지는 모르겠습니다.
      <RouterLink to="/AudioRecord">
        <button v-if="showButton" @click="showButton = false">
          Audio Upload
        </button>
      </RouterLink>
      <RouterLink to="/recommend">
        <button v-if="showButton" @click="showButton = false">Recommend</button>
      </RouterLink>
      -->
      <!--<RouterLink to="/integrated">
        <button v-if="showButton" @click="showButton = false">
          음성인식으로 추천받기
        </button>
      </RouterLink>
      -->
    </v-main>
  </v-app>
</template>

<script>

import clickSoundFile from "@/assets/click-sound.mp3";

export default {
  name: "App",
  data() {
    return {
      showButton: true,
      fontSize: 16,
      minFontSize: 16,
      maxFontSize: 28,
    };
  },

  watch: {
    $route(to) {
      this.updateShowButton(to);
    },
  },

  methods: {
    updateShowButton(route) {
      const showButtonPaths = ["/"];
      this.showButton = showButtonPaths.includes(route.path);
    },
    playClickSound() {
      const clickSound = new Audio(clickSoundFile);
      clickSound.play().catch((error) => {
        console.error("Error playing click sound:", error);
      });
    },
    handleButtonClick() {
      this.playClickSound();
      this.showButton = false;
    },
    increaseFontSize() {
      if (this.fontSize < this.maxFontSize) {
        this.fontSize += 2;
        document.documentElement.style.fontSize = this.fontSize + "px";
        console.log(`Font size increased to: ${this.fontSize}px`);
      } else {
        console.log("Reached maximum font size:", this.maxFontSize);
      }
    },
    decreaseFontSize() {
      if (this.fontSize > this.minFontSize) {
        this.fontSize -= 2;
        document.documentElement.style.fontSize = this.fontSize + "px";
        console.log(`Font size decreased to: ${this.fontSize}px`);
      } else {
        console.log("Reached minimum font size:", this.minFontSize);
      }
    },
  },
};
</script>

<style>
html {
  font-size: 16px;
}
.font-size-buttons {
  position: fixed;
  bottom: 20px;
  right: 20px;
  display: flex;
  flex-direction: row;
}
.font-size-buttons button {
  margin: 10px;
  padding: 20px;
  font-size: 30px;
  cursor: pointer;
}
</style>