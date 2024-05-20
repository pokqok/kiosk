import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
// import 'bootstrap'
import 'bootstrap-icons/font/bootstrap-icons.css'
// import 'bootstrap/dist/css/bootstrap.min.css'
import store from './store.js'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'
import clickSoundMixin from './mixins/clickSoundMixin'

loadFonts()

// Vue 애플리케이션 생성
const app = createApp(App)

// 전역 믹스인 등록
app.mixin(clickSoundMixin)

// 플러그인 및 라우터 사용
app.use(router)
app.use(store)
app.use(vuetify)

// 애플리케이션 마운트
app.mount('#app')
