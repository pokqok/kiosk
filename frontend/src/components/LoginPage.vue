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
export default {
    name: 'LoginPage',
    data() {
        return {

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