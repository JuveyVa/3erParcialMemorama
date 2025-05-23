import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { worker } from './mocks/browser';

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)


worker.start().then(() => {
    console.log('Simulador de servidor se está ejecutando')
    app.mount('#app')
  });
