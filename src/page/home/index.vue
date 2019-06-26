<template>
  <ul>
    <li v-for="product in list" :key='product.id'>
      {{ product.title }}  {{ product.price }} {{ product.inventory }}
      <button :disabled="!product.inventory"  @click="addProductToCart(product)">加入购物车</button>
    </li>
  </ul>
</template>
<script>
import { mapState, mapActions, mapGetters } from 'vuex';
 // 首页
export default {
  data() {
    return {
      // list: [],
    }
  },
  computed: mapState({
    list: state => state.products.list
  }),
  methods: {
    ...mapActions({
      addProductToCart: 'products/addProductToCart'
    }),
    initData() {
      this.$store.dispatch('products/getAllProducts')
    },
  },
  mounted() {
    this.initData()
    // this.$store.dispatch('products/getAllProducts')
  }
}
</script>
