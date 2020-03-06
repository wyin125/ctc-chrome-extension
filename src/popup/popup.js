import Vue from 'vue';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faEllipsisH } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import App from './App';
import store from '../store';
import router from './router';
import '../../output.css';

global.browser = require('webextension-polyfill');
Vue.prototype.$browser = global.browser;

library.add(faEllipsisH);
Vue.component('font-awesome-icon', FontAwesomeIcon);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App),
});
