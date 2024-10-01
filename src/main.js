// import './assets/main.css'
// import 'bootstrap/dist/css/bootstrap.css'
// import 'vue-awesome-paginate/dist/style.css'

// default css
import '@/assets/css/fonts.css'
import '@/assets/css/header.css'
import '@/assets/css/footer.css'
import '@/assets/css/base.css'
import '@/assets/css/form.css'
import '@/assets/css/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
