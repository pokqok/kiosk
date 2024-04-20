<template>
  <div class="login-page">
    <div style="display: flex; justify-content: center; align-items: center">
      <div style="width: 15%; height: 15%">
        <v-img v-if="$route.params.mode == 'shop'" src="../assets/logo.png" />
        <v-img v-if="$route.params.mode == 'admin'" src="../assets/admin.png" />
      </div>
    </div>

    <!-- ID 입력 -->
    <div class="mb-3" style="margin-left: 30%; margin-right: 30%">
      <label for="basic-url" class="form-label" style="margin-right: 100%"
        >ID</label
      >
      <input
        type="text"
        class="form-control"
        id="email"
        v-model="email"
        placeholder="Enter your ID here"
      />
    </div>

    <!-- Password 입력 -->
    <div class="mb-3" style="margin-left: 30%; margin-right: 30%">
      <label for="basic-url" class="form-label" style="margin-right: 100%"
        >Password</label
      >
      <input
        type="password"
        class="form-control"
        id="password"
        v-model="password"
        placeholder="Enter your Password here"
      />
    </div>

    <!-- login 버튼 -->
    <div>
      <button type="button" class="btn btn-success" @click="login">
        Login
      </button>
    </div>

    <button @click="goToRootPage">메인 페이지로 돌아가기</button>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "LoginPage",
  data() {
    return {
      email: "",
      password: "",
    };
  },
  methods: {
    async login() {
      if (this.$route.params.mode == "admin") {
        try {
          const response = await axios.post("admin", {
            //192.168.0.167:8081은 본인이 서버를 열때 나오는 Network 주소로 변경
            email: this.email,
            password: this.password,
          });
          if (response.data.success) {
            console.log("LOGIN SUCCESS");
            alert("로그인 완료되었습니다.");
            // 관리자 페이지로 이동
            this.$router.push("/admin/" + response.data.userID); // 이동할 페이지 위치
          } else {
            alert("로그인 실패: " + response.data.message);
          }
        } catch (error) {
          alert("로그인 요청 실패: " + error);
        }
      } else if (this.$route.params.mode == "shop") {
        try {
          const response = await axios.post("shop", {
            email: this.email,
            password: this.password,
          });
          if (response.data.success) {
            console.log("LOGIN SUCCESS");
            alert("로그인 완료되었습니다.");
            this.$store.commit("setShopID", response.data.shopID);
            this.$router.push("/mode-select"); // 이동할 페이지 위치
          } else {
            alert("로그인 실패: " + response.data.message);
          }
        } catch (error) {
          alert("로그인 요청 실패: " + error);
        }
      }
    },

    goToRootPage() {
      this.$router.push("/");
      this.$emit("comeBack");
    },
  },
};
</script>

<style>
.login-page {
  margin-top: 60px;
}
</style>
