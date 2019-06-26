import shop from '../../api/products'

const state = {
  list: [],
  shoppingCart: [], // 存储购物车的商品
}

const getters = {
  // list: state => state.products.list
}

const actions = {
  getAllProducts({ commit }) {
    shop.getProducts(products => {
      commit('setProducts', products)
    })
  },
  addProductToCart({ commit, state }, product) {
    if (product.inventory > 0) {
      commit('decrementProductInventory', { id: product.id });
      commit('addCart', { id: product.id })
    }
  }
}

const mutations = {
  setProducts(state, products) {
    state.list = products
  },
  decrementProductInventory(state, { id }) {
    const product = state.list.find(product => product.id === id);
    product.inventory--
  },
  addCart(state, { id }) {
    const item = state.shoppingCart.find(product => product.id === id);
    if (item) {
      // 如果购物车存在该商品就数量+1
      item.inventory++
    } else {
      // 加入购物车该商品
      shoppingCart.push({ ...item, inventory: 1 });
    }
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}

