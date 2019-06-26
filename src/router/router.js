import App from '../App'
import Router from 'vue-router'

export default new Router({
  routes: [{
    path: '/',
    component: App,
    children: [{
        path: '',
        component: r => require.ensure([], () => r(require('../page/home')), 'home')
    }, 
    // {
    //     path: '/cart',
    //     component: r => require.ensure([], () => r(require('../page/cart')), 'cart')
    // }, {
    //     path: '/user',
    //     component: r => require.ensure([], () => r(require('../page/user')), 'user')
    // }
    ]
  }]
})