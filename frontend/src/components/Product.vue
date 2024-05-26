<template>
  <div>
    <v-progress-linear
      v-if="loading"
      :height="10"
      color="primary"
      indeterminate
    ></v-progress-linear>
    <div v-else class="product" @click="$emit('selectProduct', product)">

      <div class="product-img-container">
        <img class="product-img" :src="getImageSrc(product)" alt="" />

      </div>
      <div class="product-info">
        <p class="product-name">{{ product.name }}</p>
        <p class="product-price">{{ parseInt(product.price) }} 원</p>

      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ProductItem",
  props: {
    product: Object,
    
  },
  data() {
    return {
      loading: true, // 데이터 로딩 상태를 나타내는 변수
    };
  },
  mounted() {
    // 로딩 애니메이션, 일단은 시간으로 넣음
    // 실제 로직은 실제 데이터 로드에 따라 구현
    setTimeout(() => {
      this.loading = false; // 데이터 로딩 완료 후 로딩 상태 변경
    }, 100);
  },
  methods: {
    getImageSrc(item) {
      // 이미지 경로가 비어있을 경우 빈 이미지를 반환하고,
      // 비어있지 않을 경우 제품 이미지 경로를 반환합니다.
      //return image ? image:"https://picsum.photos/100?random=1";
      console.log("가져온 데이터 테스트: ",item)
      
      console.log("가져온 이름들 ",item.id)
      return "https://picsum.photos/100?random=1";
    },
  },

};
</script>