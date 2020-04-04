import Vue from 'vue';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faEllipsisH, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import VueClipboard from 'vue-clipboard2';
import App from './App';
import store from '../store';
import router from './router';
import 'vue-loading-overlay/dist/vue-loading.css';
import '../../output.css';

global.browser = require('webextension-polyfill');
Vue.prototype.$browser = global.browser;

library.add(faEllipsisH);
library.add(faPaperPlane);
Vue.component('font-awesome-icon', FontAwesomeIcon);
Vue.use(VueClipboard);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App),
});
