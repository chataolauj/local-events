import { createApp } from 'vue'
import App from './App.vue'
import store from './store/index'
import './assets/main.css'

const app = createApp(App).use(store);

app.config.globalProperties.$store = store;

app.mount('#app');