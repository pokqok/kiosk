<template>
  <router-view></router-view>
  <!-- 라우터를 통해 변경된 컴포넌트가 렌더링됩니다. -->
  <v-navigation-drawer>
    <v-list-item title="실타래" subtitle="키오스크 관리"></v-list-item>
    <v-divider></v-divider>
    <v-list-item @click="goToProductManage" title="메뉴 관리"></v-list-item>
    <v-list-item @click="goToCategoyManage" title="카테고리 설정"></v-list-item>
    <v-list-item @click="goToTagManage" title="옵션 설정"></v-list-item>
    <v-list-item @click="goToKioskManage" title="키오스크 관리"></v-list-item>
    <v-list-item @click="goToUserManage" title="계정 설정"></v-list-item>
  </v-navigation-drawer>
  <button @click="goToRootPage">메인 페이지로 돌아가기</button>
  <button @click="goToProductTags">상품 태그 페이지로 가기</button>
</template>

<script>
export default {
  name: "AdminPage",
  methods: {
    goToRootPage() {
      this.$router.push("/");
      this.$emit("comeBack");
    },
    goToProductTags() {
      this.$router.push("/tags");
    },
    goToProductManage() {
      this.$router.push(
        "/admin/" + this.$store.state.ShopID + "/product-manage"
      );
    },
    goToCategoyManage() {
      this.$router.push(
        "/admin/" + this.$store.state.ShopID + "/category-manage"
      );
    },
    goToTagManage() {
      this.$router.push("/admin/" + this.$store.state.ShopID + "/tag-manage");
    },
    goToKioskManage() {
      this.$router.push("/admin/" + this.$store.state.ShopID + "/kiosk-manage");
    },
    goToUserManage() {
      this.$router.push("/admin/" + this.$store.state.ShopID + "/user-manage");
    },
  },
};
</script>

<!-- 스타일 (필요에 따라 추가) -->
<style></style>
