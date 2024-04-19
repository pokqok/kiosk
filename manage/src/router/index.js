import { createRouter, createWebHistory } from 'vue-router';
import ProductManage from '@/views/ProductManage.vue';
import CategoryManage from '@/views/CategoryManage.vue';
import TagManage from '@/views/TagManage.vue';
import KioskManage from '@/views/KioskManage.vue';
//import CardTest from '@/views/CardTest.vue';

const routes = [
  { path: '/', name: 'Home', component: CategoryManage}, //기본 시작 페이지,
  { path: '/product-manage', component: ProductManage },
  { path: '/category-manage', component: CategoryManage },
  { path: '/tag-manage', component: TagManage },
  { path: '/kiosk-manage', component: KioskManage },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
