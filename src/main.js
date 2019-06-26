// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Router from 'vue-router'
import router from './router/router'
import App from './App'
import store from './store/index'
// import {
//   AlertPlugin
// } from 'vux'

Vue.use(Router)
Vue.config.productionTip = false
// Vue.use(AlertPlugin)
/* eslint-disable no-new */
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

