<template>
  <div v-if="isPageLoaded">
    <router-view></router-view>
    <!-- 라우터를 통해 변경된 컴포넌트가 렌더링됩니다. -->
    <v-navigation-drawer>
      <v-list-item title="실타래" subtitle="키오스크 관리"></v-list-item>
      <v-divider></v-divider>
      <v-list-item @click="goToProductManage" title="메뉴 관리"></v-list-item>
      <v-list-item @click="goToCategoryManage" title="카테고리 설정"></v-list-item>
      <v-list-item @click="goToTagManage" title="옵션 설정"></v-list-item>
      <v-list-item @click="goToKioskManage" title="키오스크 관리"></v-list-item>
      <v-list-item @click="goToUserManage" title="계정 설정"></v-list-item>
      <v-list-item @click="goToOrderReceive" title="주문 접수"></v-list-item> <!-- 주문 접수 항목 추가 -->
      <v-list-item @click="goToSalesPage" title="매출 내역"></v-list-item> <!-- 매출 내역 항목 추가 -->
    </v-navigation-drawer>
    <button @click="goToRootPage">메인 페이지로 돌아가기</button>
    <button @click="goToProductTags">상품 태그 페이지로 가기</button>
  </div>
</template>

<script>
export default {
  name: "AdminPage",
  data() {
    return {
      isPageLoaded: false, // 페이지 로드 상태
    };
  },
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
    goToCategoryManage() {
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
    goToOrderReceive() {
      this.$router.push("/admin/" + this.$store.state.ShopID + "/order-receive"); // 주문 접수 메서드 추가
    },
    goToSalesPage() {
      this.$router.push("/admin/" + this.$store.state.ShopID + "/sales-page"); // 매출 내역 메서드 추가
    },
  },
  mounted() {
    // 페이지가 마운트되면 isPageLoaded를 true로 설정
    this.isPageLoaded = true;
  },
};
</script>

<!-- 스타일 (필요에 따라 추가) -->
<style></style>
