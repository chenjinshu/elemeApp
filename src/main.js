import Vue from 'vue';
import VueRouter from 'vue-router';
import VueResource from 'vue-resource';
import App from './App';
import goods from './components/goods/goods';
import ratings from './components/ratings/ratings';
import seller from './components/seller/seller';

import 'common/stylus/index.styl';

Vue.use(VueRouter);         // 注册路由模块，否则不能创建VueRouter的实例
Vue.use(VueResource);       // VueResource用于ajax请求

/* eslint-disable no-new */  // 省去这行注释会报错，eslint要求new的对象必须赋给一个变量，这行注释可以跳过eslint校验
/*
new Vue({
  el: 'body',
  components: { App }
});
*/

let app = Vue.extend(App);       // 生成App组件实例

let router = new VueRouter({
  linkActiveClass: 'active'            // 配置a链接被激活时的类名，默认是v-link-active
});
router.map({
  '/goods': {
    component: goods
  },
  '/ratings': {
    component: ratings
  },
  '/seller': {
    component: seller
  }
});
router.start(app, '#app');      // 将app实例挂载到id为app的容器中
router.go('/goods');           // 默认显示商品页面
