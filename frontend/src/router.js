import { createWebHistory, createRouter } from "vue-router";
import AdminPage from "./components/AdminPage.vue";
import LoginPage from "./components/LoginPage.vue";
import TestPage from "./components/TestPage.vue";

const routes = [
  {
    path: "/login",
    component: LoginPage,
  },
  {
    path: '/admin',
    component: AdminPage, // 관리자 페이지 라우트 추가
  },
  {
    path: '/test',
    component: TestPage,
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router; 