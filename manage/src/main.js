/*
import { createApp } from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'

import ProductManage from './views/ProductManage.vue'
import CategoryManage from './views/CategoryManage.vue';

loadFonts()

createApp(App)
  .use(vuetify)
  .component('ProductManage', ProductManage) // 상품관리 페이지
  .mount('#app')
*/

import { createApp } from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'

import router from './router' // 라우터 추가

import ProductManage from './views/ProductManage.vue'
import CategoryManage from './views/CategoryManage.vue';
import TagManage from './views/TagManage.vue'
import KioskManage from './views/KioskManage.vue'
//import CardTest from './views/CardTest.vue'
import store from './store.js'
//import categoryModule from './categoryModule'

loadFonts()

createApp(App)
  .use(router) // 라우터 등록
  .use(vuetify)
  .use(store) //vuex의 store사용
  //.use(categoryModule)
  //.component('CardTest', CardTest)
  .component('ProductManage', ProductManage)
  .component('CategoryManage', CategoryManage)
  .component('TagManage', TagManage)
  .component('KioskManage', KioskManage)
  .mount('#app')
