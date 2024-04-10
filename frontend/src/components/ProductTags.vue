<template>
    <div class="container">
      <h1>Product Tags</h1>
      <ul>
        <li v-for="(product, index) in tags" :key="index">
          <div><strong>Product ID:</strong> {{ product[0] }}</div>
          <div><strong>Name:</strong> {{ product[1] }}</div>
          <div><strong>Price:</strong> {{ product[2] }}</div>
          <div><strong>Category ID:</strong> {{ product[3] }}</div>
          <div><strong>Detail:</strong> {{ product[4] }}</div>
          <div>----------------------------------</div>
        </li>
      </ul>
      <div></div>
      <button @click="goToRootPage">메인 페이지로 돌아가기</button>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    name: 'ProductTags',
    data() {
      return {
        tags: [] // 상품 정보를 담을 빈 배열
      };
    },
    mounted() {
      this.fetchTags();
    },
    methods: {
      async fetchTags() {
        console.log('fetchTags called');
        try {
          const response = await axios.get('http://192.168.0.167:3000/tags'); //여기도 본인의 ipv4 주소로 변경 부탁드립니다.
          this.tags = response.data;
          console.log('tags:', this.tags);
        } catch (error) {
          console.error('Error fetching product tags:', error);
        }
      },
      goToRootPage() {
        this.$router.push("/");
        this.$emit("comeBack");
      }
    }
  };
  </script>
  
  <style scoped>
  .container {
    text-align: left;
    max-width: 800px; /* 필요에 따라 조정 가능 */
    margin: 0 auto; /* 가운데 정렬 후 좌측 정렬을 위해 추가 */
  }
  </style>
  