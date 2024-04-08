<template>
    <div>
        <img src="../assets/logo.png">

        <!-- ID 입력 -->
        <div class="mb-3" style="margin-left: 30%; margin-right: 30%;">
            <label for="basic-url" class="form-label" style="margin-right: 100%;">ID</label>
            <input type="text" class="form-control" id="email" v-model="email" placeholder="Enter your ID here">
        </div>

        <!-- Password 입력 -->
        <div class="mb-3" style="margin-left: 30%; margin-right: 30%;">
            <label for="basic-url" class="form-label" style="margin-right: 100%">Password</label>
            <input type="password" class="form-control" id="password" v-model="password" placeholder="Enter your Password here">
        </div>
        

        <!-- login 버튼 -->
        <div>
            <button type="button" class="btn btn-success" @click="login">Login</button>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
export default {
  name: 'LoginPage',
  data() {
    return {
      email: '',
      password: '',
    };
  },
  methods: {
    async login() {
      try {
        const response = await axios.post('http://localhost:3000/login', {
          email: this.email,
          password: this.password,
        });
        if (response.data.success) {
            console.log("LOGIN SUCCESS");
            alert('로그인 완료되었습니다.');
          // 관리자 페이지로 이동
            this.$router.push('/admin'); // 이동할 페이지 위치
        } else {
          alert('로그인 실패: ' + response.data.message);
        }
      } catch (error) {
        alert('로그인 요청 실패: ' + error);
      }
    },
  },
};
</script>

<style>
/* .login {
    margin-left: 30%;
    margin-right: 30%;
} */
</style>