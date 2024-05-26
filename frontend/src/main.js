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
