<template>
    <div class="head-container row">
        <h2 class="title">실타래 {{ $store.state.ShopID }}</h2>
    </div>

    <div style="margin-top: 10%;"></div>

    <div class="col-12 p-3">
        <button type="button" class="btn btn-outline-success custom-btn" @click="$router.push('/order-type')">일반
            주문</button>
    </div>
    <div class="col-12 p-3">
        <button type="button" class="btn btn-success custom-btn" @click="goToHelper">도우미 모드</button>
    </div>

    <!-- 미구현 -->
    <h5 style="margin-top: 10%;">언어선택</h5>
    <div class="btn-group" role="group" aria-label="Basic radio toggle button group">
        <input type="radio" class="btn-check" name="btnradio" id="btnradio1" autocomplete="off" checked>
        <label class="btn btn-outline-secondary" for="btnradio1">한국어</label>

        <input type="radio" class="btn-check" name="btnradio" id="btnradio2" autocomplete="off">
        <label class="btn btn-outline-secondary" for="btnradio2">eng</label>
    </div>

</template>

<script>
export default {
    name: 'ModeSelectPage',

    methods: {
        goToHelper() {
            alert("미구현")
        }
    }
}
</script>

<style>
.custom-btn {
    width: 30vw;
    height: 15vh;
}
</style>