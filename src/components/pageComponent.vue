<template>
 <div class="pageContiçan">
   <x-header class="page-component-header" :left-options="{showBack: false}">
    <popover class="select-router" placement="bottom" >
    <div style="background-color:#355C80" slot="content">
      <div class="select-box">
        <group class="select-contain">
          <cell style="color:white" class="select-cell ">
           <router-link class="cell-link"  to = '/' >菜单页面</router-link>
          </cell>
          <cell v-for="(item, key) in classPageArray" :key='key' style="color:white" :class="`select-cell `+ item.class">
            <router-link class="cell-link"  :to = 'item.path' >{{item.name}}</router-link>
          </cell>
        </group>
      </div>
    </div>
   <span style="display:inline-block" class="home"></span>
   </popover>
   <span @touchstart.self.prevent="prevPage()" @click="prevPage()" slot="overwrite-left" class="headback"></span>
   <span @touchstart.self.prevent="nextPage()" @click="nextPage()" slot="right" class="headrefresh"></span>
   </x-header>
   <x-header v-if="isThirdMenue" class="third-nav" :left-options="{showBack: false}">
      <div class="tab-page">
        <div class="tab-page-contain">
            <div v-for="(item, key) in thirdMenueList"  :key="key" @click="onItemClick(item.path)" :class="getStyletab(item.select)">
                <span>
                    <p>{{item.name}}</p>
                </span>
            </div>
        </div>
      </div>
   </x-header>
   <water-mark ></water-mark>
   <div class="contain-menu-componnets">
      
      <div style="position:relative;">
     <!-- <div style="opacity:1;height:3.5rem;width:24vw;position:absolute;right:0;" ></div> -->
         <div class="filter" v-if="isSelectVisiable" @touchstart="selectShow()" @click="selectShow()" >
         </div>
         <select-filter v-if="isSelectVisiable" @selectHandle="chlideSelectHandle" ref="selectModal" :selectType="childSelectType"  :selectTilte="childFilterTitle" :selectData="childDataFilter" ></select-filter>
         <slot></slot>
         <iframe-contain :style="`display:${isVisibleIframe};`"  class="iframecontent" :filterTitle="childFilterTitle" :dataFilter="childDataFilter" ref="ifrmaecontian" :frameUrl="childFrameUrl" ></iframe-contain>
      </div>
   </div>
 </div>
</template>
<script>
import { XHeader, Popover, Group, Cell, Tab, TabItem } from "vux";
import waterMark from "./watermark";
import iframeContain from "./permissioniframe";
import selectFilter from "./selectFilter";
import axios from "axios";
import { filter } from "@/api/filter";
import { setTimeout } from "timers";

export default {
  data() {
    return {
      childFilterTitle: "筛选项",
      childDataFilter: [],
      classPageArray: [],
      isThirdMenue: false,
      thirdMenueList: [],
      pagePreNex: {},
      childSelectType: "check", // radio // 多选 , check 单选 默认单选
      isVisibleIframe:"block", // iframe 是否可见
    };
  },
  // computed: {
  //   toTop: function() {
  //     return this.isThirdMenue ? '3rem' : 0
  //   }
  // },
  props: {
    childFrameUrl: String,
    urlFilter: String,
    isSelectVisiable: Boolean
  },
  components: {
    XHeader,
    waterMark,
    iframeContain,
    selectFilter,
    Popover,
    Group,
    Cell,
    Tab,
    TabItem
  },
  methods: {
    prevPage() {
      let prevPage = this.pagePreNex.prevPage;
      this.$router.push(prevPage);
    },
    nextPage() {
      let nextPage = this.pagePreNex.nextPage;
      this.$router.push(nextPage);
    },
    backHome() {
      this.$router.push({ path: "/" });
    },
    fresh() {
      this.$router.go(0);
    },
    onItemClick(path) {
      this.$router.push(path);
    },
    getFilterMessage() {
      let that = this;
      let objectFilter = {};
      if (_.isNil(this.urlFilter) || this.urlFilter == "") {
        that.$refs.ifrmaecontian.initializeViz(objectFilter);
      } else {
        let urlArray = this.urlFilter.split(",");
        let axiosArray = [];
        let responseArray = [];
        urlArray.forEach((element, index) => {
          axiosArray.push(filter(element));
        });
        axios
          .all(axiosArray)
          .then(
            axios.spread((...responseArray) => {
              {
                /**
                 * 这里是通过异步请求完成所有的筛选器的查询
                 * 当查询完毕的时候返回结果responseArray
                 * 为了满足可视化的筛选器如果筛选项存在就为
                 * 第一个筛选选项，配置时候需要注意
                 * return Object
                 */

                let index = 0;
                responseArray.forEach(element => {
                  let childTitle = "";
                  let childData = [];
                  let childFirstFilter = [];
                  let childType = "";
                  if (element.success) {
                    childTitle = element.rows[0].keyName;
                    childData = this.regularFilterList(
                      element.rows[0].keyOptions
                    );
                    childType = element.rows[0].filter.filterType;
                    if (childData.length > 0) {
                      switch (childType) {
                        case "radio":
                          childFirstFilter.push(childData[0].key);
                          break;
                        case "checkbox":
                          const handleCheck = childData => {
                            let arrayFileter = [];
                            childData.forEach(element => {
                              arrayFileter.push(element.key);
                            });
                            return arrayFileter;
                          };
                          childFirstFilter = handleCheck(childData);
                          break;
                        default:
                      }
                      objectFilter[childTitle] = childFirstFilter;
                      if (index == 0) {
                        index++;
                        that.childFilterTitle = childTitle;
                        that.childSelectType = childType;
                        that.childDataFilter = childData;
                      }
                    }
                  }
                });
                that.$refs.ifrmaecontian.initializeViz(objectFilter);
              }
            })
          )
          .catch(err => {
            console.log(err);
          });
      }
    },
    chlideSelectHandle(checkList) {
      this.changeIfrmae(this.childFilterTitle, checkList);
    },
    changeIfrmae(keyName, DataList) {
      this.$refs.ifrmaecontian.filterAllData(keyName, DataList);
    },
    selectShow() {
      this.$refs.selectModal.showMadal();
    },
    regularFilterList(arrList) {
      let arrResult = [];
      arrList.forEach(element => {
        if (element.code) {
          if (element.name) {
            arrResult.push({ key: element.code, value: element.name });
          }
        }
      });
      return arrResult;
    },
    getStyletab(select){
      let style = select ? 'tab-page-item active-page-tab' : 'tab-page-item'
      return style
    },
    //初始化页面的标准配置（页面上下切页,页面的二级级菜单,三级菜单）
    initializePage() {
      let routePath = this.$route.path;
      let routeArray = routePath.split("/");
      routeArray.shift();
      switch (routeArray.length) {
        case 2:
          this.renderSecond(routeArray);
          break;
        case 3:
          this.renderSecond(routeArray);
          this.renderTirld(routeArray);
          break;
        default:
      }
      let nowDeepRouter = routeArray.pop();
      this.changPage(routeArray, nowDeepRouter);
    },
    // 二级菜单渲染
    renderSecond(routePath) {
      let avilableMenue = this.$store.getters.avilableMenue;
      let secondeList = [];
      avilableMenue.forEach(firstMenue => {
        let firstPath = firstMenue.path.replace(/^\//, "");
        if (firstPath == routePath[0]) {
          firstMenue.children.forEach(secondMenue => {
            let menueItem = {};
            let selectedClass = ''
            if(secondMenue.path == routePath[1]){
             selectedClass = 'cell-selected'
            }
            menueItem.name = secondMenue.name;
            menueItem.class = selectedClass
            if (secondMenue.children || secondMenue.children == []) {
              menueItem.path =
                "/" +
                routePath[0] +
                "/" +
                secondMenue.path +
                "/" +
                secondMenue.children[0].path;
            } else {
              menueItem.path = "/" + routePath[0] + "/" + secondMenue.path;
            }
            secondeList.push(menueItem);
          });
        }
      });
      this.classPageArray = secondeList;
    },
    // 三级菜单渲染
    renderTirld(menuePath) {
      this.isThirdMenue = true;
      let avilableMenue = this.$store.getters.avilableMenue;
      let menuePathData = menuePath;
      let routerDeep = 0;
      let thirdMenue = [];
      const findPage = (menueList, base) => {
        menueList.forEach(routerData => {
          if (routerData.path.replace(/^\//, "") == menuePathData[routerDeep]) {
            if (routerData.children) {
              let keyword =
                (base ? base : "") + "/" + routerData.path.replace(/^\//, "");
              routerDeep++;
              findPage(routerData.children, keyword);
            } else {
              menueList.forEach(routerItem => {
                let isSelect = false;
                if (
                  routerItem.path.replace(/^\//, "") ==
                  menuePath[menuePathData.length - 1]
                ) {
                  isSelect = true;
                }
                let keyword =
                  (base ? base : "") + "/" + routerItem.path.replace(/^\//, "");
                thirdMenue.push({
                  name: routerItem.name,
                  path: keyword,
                  select: isSelect
                });
              });
            }
          }
        });
      };
      findPage(avilableMenue);
      this.thirdMenueList = thirdMenue;
      // scroll 滑动之后有效
    },
    // 页面的前页后页的跳转
    changPage(routeArray, nowDeepRouter) {
      let avilableMenue = this.$store.getters.avilableMenue;
      let menuePathData = routeArray;
      let routerDeep = 0;
      let thirdMenue = [];
      const findPage = (menueList, base) => {
        menueList.forEach(routerData => {
          if (routerData.path.replace(/^\//, "") == menuePathData[routerDeep]) {
            if (menuePathData.length - 1 > routerDeep) {
              if (routerData.children) {
                let keyword =
                  (base ? base : "") + "/" + routerData.path.replace(/^\//, "");
                routerDeep++;
                findPage(routerData.children, keyword);
              }
            } else {
              let deepPathList = [];
              let DeepRoute = 0;
              let nowDeepIndex = 0;
              routerData.children.forEach((deepRouterItem, index) => {
                if (!deepRouterItem.children) {
                  deepPathList.push(deepRouterItem.path);
                  DeepRoute++
                }
                if(deepRouterItem.path.replace(/^\//, "") == nowDeepRouter){
                  nowDeepIndex = DeepRoute
                }
              });
              // 判断出下一页以及上一页
              // 下一页
              if (nowDeepIndex + 1  > deepPathList.length ) {
                this.pagePreNex.nextPage = deepPathList[0];
              } else {
                this.pagePreNex.nextPage = deepPathList[nowDeepIndex];
              }
              // 上一页
              if (nowDeepIndex - 1 <= 0) {
                this.pagePreNex.prevPage =
                  deepPathList[deepPathList.length - 1];
              } else {
                this.pagePreNex.prevPage = deepPathList[nowDeepIndex - 2];
              }
            }
          }
        });
      };
      findPage(avilableMenue);
    }
  },
  watch: {
    thirdMenueList: {
      handler: val => {
        setTimeout(() => {
          let activeTab = document.querySelector(".active-page-tab");
          if (activeTab) {
            activeTab.scrollIntoView({block: "start", behavior: "instant", inline: "center"});
          }
        }, 200);
      },
      deep: true
    }
  },
  mounted() {
    this.getFilterMessage();
    this.initializePage();
    if(this.childFrameUrl == ''|| !this.childFrameUrl){
      this.isVisibleIframe = "none"
    }
  }
};
</script>
<style >
.third-nav {
  padding: 0 !important;
}
.third-nav .vux-header-title{
  margin: 0 !important;
  padding: 0 !important;
}
.third-nav .tab-page {
  background: transparent;
  border: none
}
.headback {
  background-image: url(../assets/header/back.png);
  width: 1.5rem;
  height: 1.5rem;
  display: block;
  background-repeat: no-repeat;
  background-size: 100% 100%;
}
.headrefresh {
  background-image: url(../assets/header/prev.png);
  width: 1.5rem;
  height: 1.5rem;
  display: block;
  background-repeat: no-repeat;
  background-size: 100% 100%;
}
.page-component-header, .third-nav{
  background-color:white !important;
  color:black;
  border-bottom: 0.5px solid #DCDDDE;
  height:3rem
}
.home {
  margin-top: 0.5rem;
  background-image: url(../assets/header/home.png);
  width: 1.5rem;
  height: 1.5rem;
  display: block;
  background-repeat: no-repeat;
  background-size: 100% 100%;
}
.filter {
  width: 2rem;
  height: 2rem;
  right: 0rem;
  margin-right: 1rem;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  position: absolute;
  background-image: url(../assets/function/filter.png);
}

.iframecontent {
  width: 100vw;
  /* height:92vh; */
}
.select-router {
  text-align: center;
}
.select-box {
  max-height: 12rem;
  overflow: hidden;
  border:  1px solid lightsteelblue;
}
.select-contain {
  overflow-x: hidden;
  overflow-y: scroll;
  max-height: 12rem;
  transform: translate3d(0, 0, 0);
  transition: height 1s ease-in-out 1s linear;
}
.select-cell {
  background-color: #355c80;
  color: #355c80;
  text-align: center;
}
.cell-selected .cell-link{
 color: white !important;
}
.cell-selected {
  background-color: #679aca;
  opacity: .8;
}
.weui-cell__ft {
  text-align: center !important;
  width: 100%;
}
.cell-link {
  font: Tahoma, Helvetica, Arial, "宋体", sans-serif;
  color: #d8e0e7 !important;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
.weui-cells {
  margin-top: 0px !important;
}
.weui-cell:before {
  border-top: 0px !important;
}
.tab-page {
  height: 3rem;
  /* width: 100vw; */
  overflow: hidden;
  -webkit-overflow-scrolling: touch;
  background-color: white;
  display: flex;
  /* position: fixed; */
  border-top: 1px solid #efefef;
  border-bottom: 1px solid #efefef;
  justify-content:center;
}

.tab-page-contain {
  height: 4rem;
  overflow-y: hidden;
  overflow-x: scroll;
  box-sizing: border-box;
  white-space: nowrap;
}

.tab-page-item {
  height: 3rem;
  display: inline-block;
  position: relative;
  text-align: center;
}

.tab-page-item p {
  box-sizing: border-box;
  padding: 0 1rem;
  font-size: 1rem;
  line-height: 3rem;
  color: #333;
  height: 3rem;
  font-family: Helvetica, Tahoma, Arial, PingFang SC, Hiragino Sans GB, Heiti SC,
    STXihei, Microsoft YaHei, SimHei, WenQuanYi Micro Hei;
}
.tab-page-item.active-page-tab span p {
  color: #198ded;
  border-bottom: 1px solid #198ded;
  height: calc(3rem + 1px);
}
.pageContian {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}
.contain-menu-componnets {
  position:relative;
  width: 100vw;
  height: calc(100vh - 6rem);
  overflow: scroll;
  -webkit-overflow-scrolling: touch;
}
.page-component-header,.vux-header .vux-header-title{
  padding: 0 12%;
}
</style>
