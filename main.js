import Vue from 'vue'
import App from './App.vue'
import router from './router'

window.apiUrl = 'http://localhost:3000';

import axios from 'axios'
import VueAxios from 'vue-axios'

import VueIziToast from 'vue-izitoast';

import 'izitoast/dist/css/iziToast.css';

import VModal from 'vue-js-modal';
Vue.use(VModal)

Vue.use(VueIziToast);

Vue.use(VueAxios, axios)

new Vue({
  router,
  render: function (h) { return h(App) }
}).$mount('#app')
