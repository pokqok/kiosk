import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import 'bootstrap-icons/font/bootstrap-icons.css'
import store from './store.js'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'
import './assets/style.css'



loadFonts()


let app = createApp(App)
app.use(router).use(store).use(vuetify).mount('#app')

// // Vue 애플리케이션 생성
// const app = createApp(App)

// // 플러그인 및 라우터 사용
// app.use(router)
// app.use(store)
// app.use(vuetify)

// // 애플리케이션 마운트
// app.mount('#app')
