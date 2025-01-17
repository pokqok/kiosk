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
import IntegratedComponent from "./components/IntegratedComponent.vue";
import HelperPage from "./components/HelperPage.vue";
import OrderReceive from "./components/OrderReceive.vue"; // OrderReceive 컴포넌트 임포트
import SalesPage from "./components/SalesPage.vue"; // SalesPage 컴포넌트 임포트

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
      {
        path: 'order-receive',
        component: OrderReceive // 새로운 라우트 추가
      },
      {
        path: 'sales-page',
        component: SalesPage // 매출 내역 페이지 라우트 추가
      }
    ]
  },
  {
    path: '/shop/:id',
    component: ShopPage,
  },
  {
    path: '/helper/:id',
    component: HelperPage,
  },
  {
    path: '/payment',
    name: 'PaymentPage',
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
    path: '/order-type/:mode',
    component: OrderTypePage,
  },
  {
    path: '/recommend',
    component: RecommendView,
  },
  {
    path: '/integrated',
    component: IntegratedComponent,
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
// // ./src/router.js

// import { createWebHistory, createRouter } from "vue-router";
// import AdminPage from "./components/AdminPage.vue";
// import LoginPage from "./components/LoginPage.vue";
// import ShopPage from "./components/ShopPage.vue";
// import PaymentPage from "./components/PaymentPage.vue";
// import ProductTags from "./components/ProductTags.vue";
// import ModeSelectPage from "./components/ModeSelectPage.vue";
// import OrderTypePage from "./components/OrderTypePage.vue";
// import AudioRecord from "./components/AudioRecord.vue";
// import ProductManage from './components/ProductManage.vue';
// import CategoryManage from './components/CategoryManage.vue';
// import TagManage from './components/TagManage.vue';
// import KioskManage from './components/KioskManage.vue';
// import UserManage from "./components/UserManage.vue";
// import RecommendView from "./components/RecommendView.vue";
// import IntegratedComponent from "./components/IntegratedComponent.vue";
// import HelperPage from "./components/HelperPage.vue";
// import OrderReceive from "./components/OrderReceive.vue"; // OrderReceive 컴포넌트 임포트

// const routes = [
//   {
//     path: "/login/:mode",
//     component: LoginPage,
//   },
//   {
//     path: '/admin/:id',
//     component: AdminPage, // 관리자 페이지 라우트 추가
//     children: [
//       {
//         path: '',
//         component: ProductManage
//       },
//       {
//         path: 'product-manage',
//         component: ProductManage
//       },
//       {
//         path: 'category-manage',
//         component: CategoryManage
//       },
//       {
//         path: 'tag-manage',
//         component: TagManage
//       },
//       {
//         path: 'kiosk-manage',
//         component: KioskManage
//       },
//       {
//         path: 'user-manage',
//         component: UserManage
//       },
//       {
//         path: '/product-manage', component: ProductManage
//       },
//       {
//         path: '/category-manage', component: CategoryManage
//       },
//       {
//         path: '/tag-manage', component: TagManage
//       },
//       {
//         path: '/kiosk-manage', component: KioskManage
//       },
//       {
//         path: 'order-receive',
//         component: OrderReceive // 새로운 라우트 추가
//       }
//     ]
//   },
//   {
//     path: '/shop/:id',
//     component: ShopPage,
//   },
//   {
//     path: '/helper/:id',
//     component: HelperPage,
//   },
//   {
//     path: '/payment',
//     component: PaymentPage,
//   },
//   {
//     path: '/AudioRecord',
//     name: 'AudioRecord',
//     component: AudioRecord,
//   },
//   {
//     path: '/tags',
//     name: 'ProductTags',
//     component: ProductTags,
//   },
//   {
//     path: '/mode-select',
//     component: ModeSelectPage,
//   },
//   {
//     path: '/order-type/:mode',
//     component: OrderTypePage,
//   },
//   {
//     path: '/recommend',
//     component: RecommendView,
//   },
//   {
//     path: '/integrated',
//     component: IntegratedComponent,
//   }
// ];

// const router = createRouter({
//   history: createWebHistory(),
//   routes,
// });

// export default router;
