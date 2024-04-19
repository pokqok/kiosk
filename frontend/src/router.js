import { createWebHistory, createRouter } from "vue-router";
import AdminPage from "./components/AdminPage.vue";
import LoginPage from "./components/LoginPage.vue";
import ShopPage from "./components/ShopPage.vue";
import PaymentPage from "./components/PaymentPage.vue";
import ProductTags from "./components/ProductTags.vue";
import ModeSelectPage from "./components/ModeSelectPage.vue";
import OrderTypePage from "./components/OrderTypePage.vue";
import AudioRecord from "./components/AudioRecord.vue";
import ProductManage from './components/ProductManage.vue';
import CategoryManage from './components/CategoryManage.vue';
import TagManage from './components/TagManage.vue';
import KioskManage from './components/KioskManage.vue';
import UserManage from "./components/UserManage.vue";
import RecommendView from "./components/RecommendView.vue";

const routes = [
  {
    path: "/login/:mode",
    component: LoginPage,
  },
  {
    path: '/admin/:id',
    component: AdminPage, // 관리자 페이지 라우트 추가
    children: [
      {
        path: '',
        component: ProductManage
      },
      {
        path: 'product-manage',
        component: ProductManage
      },
      {
        path: 'category-manage',
        component: CategoryManage
      },
      {
        path: 'tag-manage',
        component: TagManage
      },
      {
        path: 'kiosk-manage',
        component: KioskManage
      },
      {
        path: 'user-manage',
        component: UserManage
      },
    ]
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
    path: '/AudioRecord',
    name: 'AudioRecord',
    component: AudioRecord,
  },
  {
    path: '/tags',
    name: 'ProductTags',
    component: ProductTags,
  },
  {
    path: '/mode-select',
    component: ModeSelectPage,
  },
  {
    path: '/order-type',
    component: OrderTypePage,
  },
  {
    path: '/recommend',
    component: RecommendView,
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router; 