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

  watch: {
    '$route'(to) {
      this.updateShowButton(to);
    }
  },

  methods: {
    updateShowButton(route) {
      const showButtonPaths = ['/'];
      this.showButton = showButtonPaths.includes(route.path);
    },
  }
};
</script>