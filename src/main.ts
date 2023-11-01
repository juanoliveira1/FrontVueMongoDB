import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { store, key } from './store/index'
import BootstrapVue3 from 'bootstrap-vue-3'
import { BToastPlugin } from 'bootstrap-vue-3'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue-3/dist/bootstrap-vue-3.css'
import './assets/css/toastr-styles.css';


createApp(App).use(store, key).use(router).use(BootstrapVue3).use(BToastPlugin).mount('#app')
