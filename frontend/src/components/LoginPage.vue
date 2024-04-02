<template>
    <div>
        <img src="../assets/logo.png">

        <!-- ID 입력 -->
        <div class="mb-3" style="margin-left: 30%; margin-right: 30%;">
            <label for="basic-url" class="form-label" style="margin-right: 100%;">ID</label>
            <input type="text" class="form-control login" placeholder="Enter your ID here"
                aria-label="Enter your ID here" aria-describedby="basic-addon1">
        </div>

        <!-- Password 입력 -->
        <div class="mb-3" style="margin-left: 30%; margin-right: 30%;">
            <label for="basic-url" class="form-label" style="margin-right: 100%">Password</label>
            <input type="text" class="form-control login" placeholder="Enter your Password here"
                aria-label="Enter your Password here" aria-describedby="basic-addon1">
        </div>

        <!-- login 버튼 -->
        <div>
            <button type="button" class="btn btn-success">Login</button>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
export default {
    name: 'LoginPage',
    data() {
        return {
            userId: '', // 사용자 ID
            password: '', // 사용자 비밀번호
        }
    },
    methods: {
        async login() {
            console.log("Logging in with:", this.userId, this.password);
            try {
                const response = await axios.post('/login', { // 로그인 요청 주소
                    username: this.userId,
                    password: this.password,
                });
                if (response.data.success) {
                    alert('로그인 완료');
                    // 로그인 성공 후의 처리. 예: 메인 페이지로 리다이렉트
                    this.$router.push('/main'); // 예시, 실제 라우트 경로에 맞게 수정해야 함
                } else {
                    alert('로그인 실패: ' + response.data.message);
                }
            } catch (error) {
                alert('로그인 요청 실패: ' + error);
            }
        }
    }
}
</script>

<style>
/* .login {
    margin-left: 30%;
    margin-right: 30%;
} */
</style>