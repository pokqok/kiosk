<template>
  <v-app>
    <v-main>
      <RouterView @comeBack="showButton = true"></RouterView>
      <RouterLink to="/login/admin">
        <button v-if="showButton" @click="showButton = false">
          관리자 로그인
        </button>
      </RouterLink>
      <RouterLink to="/login/shop">
        <button v-if="showButton" @click="showButton = false">
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
      <FontSizeControls />
    </v-main>
  </v-app>
</template>

<script>
import FontSizeControls from "./components/FontSizeControls.vue";

export default {
  name: "App",
  components: {
    FontSizeControls,
  },
  data() {
    return {
      showButton: true,
    };
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

button {
  margin: 10px;
  padding: 12px 20px;
  font-size: 16px;
  font-weight: bold;
  color: #ffffff;
  background-color: #3498db;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(52, 152, 219, 0.5);
  transition: background-color 0.3s, box-shadow 0.3s;
}

button:hover {
  background-color: #2980b9;
  box-shadow: 0 4px 10px rgba(52, 152, 219, 0.7);
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield;
}
</style>
