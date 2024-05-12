<template>
  <div class="head-container">
    <h2 class="title">실타래 {{ $store.state.ShopID }}</h2>
  </div>

  <div style="margin-top: 10%"></div>

  <v-container>
    <div>
      <v-btn
        @click="goToNext('common')"
        large
        block
        class="pa-12"
      >
      <i class="bi bi-hand-index-thumb" style="font-size: 2rem; margin-right: 10px;"></i>
      일반 주문
      </v-btn>
    </div>
    <div>
      <v-btn
        @click="goToNext('helper')"
        large
        block
        class="mt-10 pa-12"
      >
      <i class="bi bi-mic" style="font-size: 2rem; margin-right: 10px;"></i>
      도우미 모드
      </v-btn>
    </div>
  </v-container>
  <svg-icon type="mdi" :path="path"></svg-icon>

  <!-- 미구현 -->
  <v-flex xs12 sm6 class="py-2">
    <h5 style="margin-top: 10%;">언어선택</h5>
    <v-btn-toggle v-model="Language" mandatory>
      <v-btn flat>
        한국어
      </v-btn>
      <v-btn flat>
        Eng
      </v-btn>
    </v-btn-toggle>
  </v-flex>
</template>

<script>
export default {
  name: "ModeSelectPage",
  data() {
    return {
      Language: 0,
    }
  },

  methods: {
    goToNext(mode) {
      this.$router.push('/order-type/'+mode)
    },
  },

  // 로그인 정보 받아올 수 있을 때 사용
  // mounted() {
  //     if(this.$store.state.ShopID == -1) {
  //         alert("login error")
  //         this.$router.push('/login/shop')
  //     }
  // }
};
</script>

<style>
</style>
