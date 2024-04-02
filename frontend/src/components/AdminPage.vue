<template>
    <div class="admin-page">
      <h1>관리자 페이지</h1>
      <p>뭔가 텅 비어 보여서 적었습니다. 이 글이 보이면 위에 Test Open 이랑 go UI를 이 페이지에서 안뜨게 해주세요</p>
      <button @click="goToRootPage">메인 페이지로 돌아가기</button>
    </div>
  </template>
  
  <script>
  export default {
    name: 'AdminPage',
    methods: {
      goToRootPage() {
        // 루트 페이지로 이동
        this.$router.push('/');
      }
    }
  };
  </script>
  
  <!-- 스타일 (필요에 따라 추가) -->
  <style>
  .admin-page {
    /* 스타일링 */
  }
  </style>
  