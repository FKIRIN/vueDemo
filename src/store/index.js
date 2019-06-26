import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import app from './modules/app'
import products from './modules/products'
import getters from './getter'

Vue.use(Vuex)

const state = {
  pageMessage : [
    // {
    //   parentPath:{ //the current nowPageClass
    //     home2:{ // the current router name
    //       prev:'home1', // the last page router path
    //       next:'home2' //  the next page router path
    //     }
    //   }
    // }
  ],
  nowPageClass : null
}

export default new Vuex.Store({
  modules:{
    user,
    app,
    products,
  },
  getters
})
