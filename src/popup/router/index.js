import Vue from 'vue';
import VueRouter from 'vue-router';
import 'vue-select/dist/vue-select.css';
import routes from './routes';

Vue.use(VueRouter);

export default new VueRouter({
  routes,
});
