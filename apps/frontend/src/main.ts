import './styles.scss';
import router from './router';
import { createApp } from 'vue';
import App from './App.vue';
import { createPinia } from 'pinia';

const app = createApp(App);
const pinia = createPinia()
app.use(pinia)
app.use(router);
app.mount('#root');
