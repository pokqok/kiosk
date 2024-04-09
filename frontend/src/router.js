import { createWebHistory, createRouter } from "vue-router";
import AdminPage from "./components/AdminPage.vue";
import LoginPage from "./components/LoginPage.vue";
import TestPage from "./components/TestPage.vue";
import ShopPage from "./components/ShopPage.vue";
import PaymentPage from "./components/PaymentPage.vue";
import AudioUpload from "./components/AudioUpload.vue";

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
  },
  {
    path: '/payment',
    component: PaymentPage,
  },
  {
    path: '/audio-upload',
    name: 'AudioUpload',
    component: AudioUpload,
  }
  
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router; 