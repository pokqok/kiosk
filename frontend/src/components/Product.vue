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
        <img class="product-img" :src="getImageUrl(product.image)" alt="" />

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
    
    getImageUrl(imageFileName) {
      // public/image/ 디렉토리에서 이미지를 가져옵니다.
      console.log(`../../public/image/${imageFileName}`);
      if(!imageFileName){
        return "https://picsum.photos/100?random=1"; //비어있는 경우 랜덤 이미지.
      }
      return `/image/${imageFileName}`;
    },
  },

};
</script>

<style>
.product {
  background-color: white;
  border: 1px solid #e1e1e1;
  margin: 4%;
  border-radius: 8px;
  overflow: hidden;
  transition: box-shadow 0.3s ease;
  cursor: pointer;
}

.product:hover {
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}

.product-img-container {
  width: 100%;
  height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f9f9f9;
}

.product-img {
  max-width: 80%;
  max-height: 80%;
}

.product-info {
  padding: 10px;
}

.product-name {
  font-weight: bold;
  color: #333;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.product-price {
  color: #666;
  margin: 5px 0 0;
}
</style>
