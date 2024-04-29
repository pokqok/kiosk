<template>
  <div class="head-container row">
    <div class="col-4">
      <button @click="$router.go(-1)" type="button" class="btn btn-light">
        <i class="bi bi-x-lg icon"></i>
        <p>취소</p>
      </button>
    </div>
    <h2 class="title mb-4 col-4">실타래 {{ ShopID }}</h2>
  </div>
  <div style="margin-top: 15%;">
    <div v-if="step == 0">
      <v-btn @click="startRecord" size="x-large" icon="$vuetify"><i
          class="bi bi-mic-fill x-lg"></i></v-btn>
      <h3 style="margin-top: 3%;">버튼을 눌러서 음성인식을 실행해주세요</h3>
    </div>
    <div v-if="step == 1">
      <v-progress-circular indeterminate :size="60" :width="6"></v-progress-circular>
    </div>
    <div v-if="step == 2">
      <div class="row">
        <!-- test, 나중에 testdata대신 음성인식 추천 목록-->
        <ProductItem
          :product="testdata[i]"
          class="col-3"
          @selectProduct="openProductOptionModal($event)"
          v-for="i in 3"
          :key="i"
        ></ProductItem>
        <h3>추천 메뉴입니다</h3>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import ProductItem from "./Product.vue";

export default {
  name: 'HelperPage',
  data() {
    return {
      step: 0
    }
  },
  computed: {
    ...mapState(["ShopID", "testdata"])
  },
  components: {
    ProductItem,
  },

  methods: {
    startRecord() {
      this.step++

      //여기에 음성인식 코드
      //console.log(결과) 부탁드립니다.

      //임시 코드. 음성인식 되면 삭제 해주세요
      setTimeout(() => {
        this.$nextTick(() => {
          this.step++
        });
      }, 3000);
    },

    //미구현
    openProductOptionModal(data) {
      console.log(data)
      alert("미구현")
    },
  },

}
</script>

<style></style>