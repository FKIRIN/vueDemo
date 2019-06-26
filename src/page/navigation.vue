<template>
<div style="height:100vh;background:#f5f6f8">
  <x-header style="background-color:white;color:black;height:3.5rem;" :left-options="{showBack: false}">
   <span slot="overwrite-left" class="logo"></span>
  </x-header>
 <flexbox v-for="(item, key) in pageTotalClass" :key='key' style="margin-top:4rem;">
      <flexbox-item v-for="(element, key) in item" :key='key'>
        <div  class="flex-demo">
          <div :style="`filter: grayscale(${element.opacity});-webkit-filter:grayscale(${element.opacity});`" v-show="element.isShow" class="iconbody">
            <img style="width:95%;height:95%" @click="golink(element.belongClass)"  slot="icon" :src='element.src'>
          </div>
        <p class="coinlabel" slot="label">{{element.text}}</p>
        </div>
      </flexbox-item>
 </flexbox>
</div>
</template>
<script>
import { XHeader, Grid, GridItem, Flexbox, FlexboxItem } from "vux";
import _ from "lodash";
import { setTimeout } from "timers";
import {mapGetters,mapState} from 'vuex';
import { firstPagePath } from '@/utils/appPath'

export default {
  components: {
    XHeader,
    Grid,
    GridItem,
    Flexbox,
    FlexboxItem
  },
  data() {
    return {
      pageTotalClass: [],
      listClass:[],
    };
  },
  watch: {
    avilableMenue: {
      handler: function(val){
        this.filtersMennue(this.listClass,val)
      },
      deep: true
    }
  },
  methods: {
    golink(classes) {
      let pageList = this.$store.getters.avilableMenue;
      let that = this
      let childrenClassList = []
      let pathDeep = ''
      pageList.forEach(routerItem => {
        if(routerItem.path.replace(/^\//, "") == classes ){
          if(routerItem.children == undefined){
              pathDeep = "/"+ classes
           } else if(routerItem.children.length > 0 ) {
              childrenClassList = routerItem.children
              pathDeep = "/"+ classes + firstPagePath(childrenClassList)
           }else{

           }
        }
      })

      that.$router.push(pathDeep)
    },
    navigationList(listClass) {
      let index = 0;
      let allList = [];
      let threeList = [];
      for (let key in listClass) {
        threeList.push(listClass[key]);
        index++;
        if (index % 3 == 0 || index == listClass.length) {
          if (index == listClass.length) {
            for (let i = 0; i < allList.length % 3; i++) {
              threeList.push({
                id: "",
                belongClass: "",
                src: "",
                text: "",
                isShow: false,
                opacity: 0.4
              });
            }
          }
          allList.push(threeList);
          threeList = [];
        }
      }
      return allList;
    },
    filtersMennue(listClass, roleMenue) {
      listClass.forEach(element => {
        element.opacity = 1;
        let belongClass = element.belongClass;
        roleMenue.forEach( routerItem => {
          if(routerItem.path.replace(/^\//, "") == belongClass){
             if(routerItem.children.length > 0 || routerItem.children == undefined){
               element.opacity = 0;
             }
          }
        })
      });
      this.pageTotalClass = this.navigationList(listClass);
    }
  },
  computed: {
    ...mapGetters({
      avilableMenue: "avilableMenue"
    })
  },
  mounted() {
    /**
     * object  navigation config
     * 菜单栏配置
     * protype
     * id  可不填 标识
     * belongclass  分类 [require] 和page下面的文件名一一对应
     * src 图标的文件引入 编码格式  [require] 目录路径 /assets/navigation/
     * text 图标显示的文字
     * isShow 图标的可见性
     */
    this.listClass = [
      {
        id: 1,
        belongClass: "home",
        src: require("@/assets/navigation/home.png"),
        text: "首页",
        isShow: true
      },
      {
        id: 2,
        belongClass: "investment",
        src: require("@/assets/navigation/investment.png"),
        text: "投资主题",
        isShow: true
      },
      {
        id: 3,
        belongClass: "building",
        src: require("@/assets/navigation/build.png"),
        text: "开发建设",
        isShow: true
      },
      {
        id: 4,
        belongClass: "operate",
        src: require("@/assets/navigation/manage.png"),
        text: "经营管理",
        isShow: true
      },
      {
        id: 5,
        belongClass: "financial",
        src: require("@/assets/navigation/finance.png"),
        text: "财务主题",
        isShow: true
      },
      {
        id: 6,
        belongClass: "humanresources",
        src: require("@/assets/navigation/personel.png"),
        text: "人力资源",
        isShow: true
      },
      {
        id: 7,
        belongClass: "factory",
        src: require("@/assets/navigation/factory.png"),
        text: "单厂主题",
        isShow: true
      }
    ];
    this.filtersMennue(this.listClass,this.avilableMenue)
  }
};
</script>
<style scoped>
.logo {
  background-image: url(../assets/header/logo.png);
  width: 4rem;
  height: 2rem;
  display: block;
  background-repeat: no-repeat;
  background-size: 100% 100%;
}
.iconbody {
  padding: 0.3rem;
  width: 2.1rem;
  height: 2.1rem;
  border: 1px solid #4477a3;
  border-radius: 50%;
  display: inline-block;
}
.coinlabel {
  color: black;
  font-size: 0.8rem;
  display: block;
  margin-top: 0.8rem;
}
.flex-demo {
  text-align: center;
}
</style>
