<template>
  <v-app>
    <v-main>
      <RouterView @comeBack="showButton = true"></RouterView>
      <RouterLink to="/login/admin">
        <button v-if="showButton" @click="showButton = false">
          go admin Login
        </button>
      </RouterLink>
      <RouterLink to="/login/shop">
        <button v-if="showButton" @click="showButton = false">
          go shop Login
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
      <RouterLink to="/integrated">
        <button v-if="showButton" @click="showButton = false">
          음성인식으로 추천받기
        </button>
      </RouterLink>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      showButton: true,
    };
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif; /* 기본 폰트 유지 */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50; /* 기본 텍스트 색상 유지 */
}

button {
  margin: 10px;
  padding: 12px 20px; /* 버튼 패딩 조정 */
  font-size: 16px; /* 버튼 폰트 크기 조정 */
  font-weight: bold; /* 글자 두께 bold로 설정 */
  color: #ffffff; /* 텍스트 색상 흰색으로 설정 */
  background-color: #3498db; /* 밝은 파란색으로 버튼 색상 설정 */
  border: none; /* 테두리 제거 */
  border-radius: 5px; /* 버튼의 모서리 둥글게 */
  cursor: pointer; /* 클릭 가능한 요소 표시 */
  box-shadow: 0 2px 5px rgba(52, 152, 219, 0.5); /* 버튼에 그림자 효과 추가 */
  transition: background-color 0.3s, box-shadow 0.3s; /* 색상과 그림자 변화에 애니메이션 효과 */
}

button:hover {
  background-color: #2980b9; /* 호버 시 버튼 색상 진한 파란색으로 변경 */
  box-shadow: 0 4px 10px rgba(52, 152, 219, 0.7); /* 호버 시 그림자 효과 강조 */
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none; /* Chrome, Safari에서 스피너 제거 */
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield; /* Firefox에서 스피너 제거 */
}
</style>
