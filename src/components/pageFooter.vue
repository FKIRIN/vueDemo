<template>
  <div>
    <tabbar-item selected link='/home'>
      <span slot='label'>首页</span>
    </tabbar-item>
     <tabbar-item link='/cart'>
      <span slot='label'>购物车</span>
    </tabbar-item>
     <tabbar-item link='/user'>
      <span slot='label'>我的</span>
    </tabbar-item>
  </div>
</template>
<script>
import { Tabber, TabberItem } from 'vux'
export default {
  components: {
    Tabber,
    TabberItem,
  }
}
</script>

