import { createWebHistory, createRouter } from "vue-router";
import AdminPage from "./components/AdminPage.vue";
import LoginPage from "./components/LoginPage.vue";
import TestPage from "./components/TestPage.vue";
import ShopPage from "./components/ShopPage.vue"

const routes = [
  {
    path: "/login/:mode",
    component: LoginPage,
  },
  {
    path: '/admin/:id',
    component: AdminPage, // 관리자 페이지 라우트 추가
  },
  {
    path: '/test',
    component: TestPage,
  },
  {
    path: '/shop/:id',
    component: ShopPage,
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router; 