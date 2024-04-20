<template>
  <v-app>
    <v-main>
      <router-view></router-view>
      <!-- 라우터를 통해 변경된 컴포넌트가 렌더링됩니다. -->
      <v-navigation-drawer v-model="drawer" color="success">
        <v-list-item title="실타래" subtitle="키오스크 관리"></v-list-item>
        <v-divider></v-divider>
        <v-list-item link to="/product-manage" title="메뉴 관리"></v-list-item>
        <v-list-item
          link
          to="/category-manage"
          title="카테고리 설정"
        ></v-list-item>
        <v-list-item link to="/tag-manage" title="옵션 설정"></v-list-item>
        <v-list-item
          link
          to="/kiosk-manage"
          title="키오스크 관리"
        ></v-list-item>
      </v-navigation-drawer>
    </v-main>
  </v-app>
</template>

<script>
import ProductManage from "./views/ProductManage.vue";
import CategoryManage from "./views/CategoryManage.vue";
import TagManage from "./views/TagManage.vue";
import KioskManage from "./views/KioskManage.vue";
//import CardTest from './views/CardTest.vue'

import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", component: CategoryManage },
    { path: "/product-manage", component: ProductManage },
    { path: "/category-manage", component: CategoryManage },
    { path: "/tag-manage", component: TagManage },
    { path: "/kiosk-manage", component: KioskManage },
    //컴포넌트 라우터 추가
  ],
});

export default {
  name: "App",

  /*
  components: {
    ProductManage,
    CategoryManage,
  },
*/
  data: () => ({
    drawer: true,
  }),

  router: router, // 라우터 등록
};
</script>
