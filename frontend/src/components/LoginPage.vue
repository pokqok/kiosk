<template>
  <v-container class="login-page">
      <div style="width: 20%;">
        <v-img v-if="$route.params.mode == 'shop'" src="../assets/logo.png" />
        <v-img class="ma-5" v-if="$route.params.mode == 'admin'" src="../assets/admin.png" />
      </div>
    

    <v-form
    ref="form"
    v-model="valid"
    lazy-validation
    style="width: 50%;"
    >
      <v-text-field
        v-model="email"
        :rules="IDRules"
        label="ID"
        required
      ></v-text-field>

      <v-text-field
        v-model="password"
        :rules="passwordRules"
        label="password"
        required
      ></v-text-field>

      <v-btn
        :disabled="!valid"
        color="success"
        @click="handleLoginClick"
      >
        Login
      </v-btn>
    </v-form>

    <button @click="handleGoToRootPageClick">메인 페이지로 돌아가기</button>
  </v-container>
</template>

<script>
import axios from "axios";
import clickSoundFile from "@/assets/click-sound.mp3";

export default {
  name: "LoginPage",
  data() {
    return {
      email: "",
      password: "",
      valid: true,
      IDRules: [
        v => !!v || 'ID is required',
      ],
      passwordRules: [
        v => !!v || 'Password is required',
      ],
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

    playClickSound() {
        const clickSound = new Audio(clickSoundFile);
        clickSound.play().catch((error) => {
          console.error("Error playing click sound:", error);
        });
      },
  
      handleLoginClick() {
        this.playClickSound();
        this.login();
      },
  
      handleGoToRootPageClick() {
        this.playClickSound();
        this.goToRootPage();
      },
  },
};
</script>

<!-- <template>
  <div class="login-page">
    <div style="display: flex; justify-content: center; align-items: center">
      <div style="width: 15%; height: 15%">
        <v-img v-if="$route.params.mode == 'shop'" src="../assets/logo.png" />
        <v-img v-if="$route.params.mode == 'admin'" src="../assets/admin.png" />
      </div>
    </div>

    <v-form
      ref="form"
      v-model="valid"
      lazy-validation
      style="margin-left: 25%; margin-right: 25%"
    >
      <v-text-field
        v-model="email"
        :rules="IDRules"
        label="ID"
        required
      ></v-text-field>

      <v-text-field
        v-model="password"
        :rules="passwordRules"
        label="password"
        required
      ></v-text-field>

      <v-btn :disabled="!valid" color="success" @click="handleLoginClick">
        Login
      </v-btn>
    </v-form>

    <button @click="handleGoToRootPageClick">메인 페이지로 돌아가기</button>
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
      valid: true,
      IDRules: [(v) => !!v || "ID is required"],
      passwordRules: [(v) => !!v || "Password is required"],
    };
  },
  methods: {
    async login() {
      if (this.$route.params.mode == "admin") {
        try {
          const response = await axios.post("admin", {
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

    handleLoginClick() {
      this.playClickSound();
      this.login();
    },

    handleGoToRootPageClick() {
      this.playClickSound();
      this.goToRootPage();
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
.login-page {
  margin-top: 60px;
}
</style> -->
