import 'bootstrap/dist/css/bootstrap.min.css';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';

import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';

// Import Firebase initialization
import '@/firebase/init';  // Path to the new init file

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(PrimeVue, { theme: { preset: Aura } });
app.use(router);

app.mount('#app');