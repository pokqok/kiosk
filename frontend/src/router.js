import { createWebHistory, createRouter } from "vue-router";
import AdminPage from './components/AdminPage.vue';
import LoginPage from "./components/LoginPage.vue"

const routes = [
  {
    path: "/login",
    component: LoginPage,
  },
  {
    path: '/admin',
    component: AdminPage, // 관리자 페이지 라우트 추가
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router; 