import {role, RoleMenus, routerMenue} from '@/api/app'
import _ from 'lodash'

const app = {
  state: {
    roleMenue:{},
    username:"",
    className:"",
    userRouter:[],
    routerMenue:{},
    avilableMenue:[]
  },
  mutations:{
    SET_USER_NAME:(state, name) => {
      state.username = name
    },
    SET_ROLE_MENUE:(state, roleMenue) => {
      state.roleMenue = roleMenue
    },
    SET_CHECK_CLASS:(state, className) => {
      state.className = className
    },
    SET_USER_ROUTER:(state, userRouter) => {
      state.userRouter = userRouter
    },
    SET_ROUTER_MENUE:(state, routerMenue) => {
      state.routerMenue = routerMenue
    },//avilableMenue
    SET_AVILSBLE_MENUE:(state, avilableMenue) => {
      state.avilableMenue = avilableMenue
    }
  },
  actions:{
    // 获取用户的用户名信息
    getRole({ commit }){
      return new Promise ((resovle, reject) => {
        role().then((response) => {
          commit('SET_USER_NAME',response.rows[0].userName)
          resovle(response)
        }).catch((error) => {
          reject(error)
        })
      })
    },
    // 获取用户的路由表
    getMennue({ commit },vuedata){
      return new Promise ((resovle, reject) => {
        RoleMenus().then((response) => {
          let $root = vuedata.root
          let $router = vuedata.router
          if(response.success){
            let virtualRouter = response.rows
            commit('SET_USER_ROUTER',_.cloneDeep(virtualRouter))
            commit('SET_ROLE_MENUE',setPageMessage(virtualRouter))
            // let filterROuter = getRoutes(virtualRouter,$root)
            // extendRoutes(filterROuter,$root,$router)
          }
          resovle(response)
        }).catch((error) => {
          reject(error)
        })
      })
    },
    // 改变选中类别
    setClassName({commit},className){
      commit('SET_CHECK_CLASS',className)
    },
    // 实现用户的路由信息的排列
    setRouterMenue({commit}, vuedata){
      return new Promise ((resovle, reject) => {
        routerMenue().then((response) => {
          let $root = vuedata.root
          let $router = vuedata.router
          if(response.success){
            let virtualRouter = response.rows
            let deepVirtualRouter = _.cloneDeep(virtualRouter)
            let dealRouter = dealMenuData(deepVirtualRouter)
            let filtersRouter = getRoutes(dealRouter,$root)
            commit('SET_ROUTER_MENUE',_.cloneDeep(dealRouter))
            commit('SET_AVILSBLE_MENUE',_.cloneDeep(filtersRouter))
            extendRoutes(filtersRouter,$root,$router)
          }
          resovle(response)
        }).catch((error) => {
          reject(error)
        })
      })
    }
  }
}
// 结构整理方法
function setPageMessage(resData) {
  // divided the page in diffrent class
  // finallyData = {
  //   home:{
  //     home1: 'home1',
  //     home2: 'home2'
  //   }
  // }
  let pageMessage = {};
  let mapPage = new Map();
  if (resData.length) {
    resData.forEach(element => {
      if (mapPage.get(element.parentPath)) {
        pageMessage[element.parentPath][element.path] = element.name;
      } else {
        mapPage.set(element.parentPath, element.parentPath);
        pageMessage[element.parentPath] = {};
        pageMessage[element.parentPath][element.path] = element.name;
      }
    });
  }
  return addPageDivid(pageMessage);
}
/**
 *
 * @description get the data
 * data = {
 *    home:{
 *        home1:{
 *                  prev:home2
 *                  name: home1
 *                  after:home2
 *              }
 *    }
 * }
 * @param {*} pageClass
 */
function addPageDivid( pageClass) {
  let cloneOrigin = _.cloneDeep(pageClass)
  for (let attr in cloneOrigin) {
    let arryPage= Object.keys(cloneOrigin[attr]);
    let arryPagelength = arryPage.length
    if(arryPagelength < 2){
      pageClass[attr][arryPage[0]] = {}
      pageClass[attr][arryPage[0]]['next'] = arryPage[0]
      pageClass[attr][arryPage[0]]['name'] = cloneOrigin[attr][arryPage[0]]
      pageClass[attr][arryPage[0]]['prev'] = arryPage[0]
    }else{
      arryPage.forEach((element,index,array) => {
        pageClass[attr][element] = {}
       if(index==0){
        pageClass[attr][element]['prev'] = array[arryPagelength-1]
        pageClass[attr][element]['next'] = array[1]
       } else if(index == arryPagelength-1){
        pageClass[attr][element]['prev'] = array[arryPagelength-2]
        pageClass[attr][element]['next'] = array[0]
       } else{
        pageClass[attr][element]['prev'] = array[index-1]
        pageClass[attr][element]['next'] = array[index+1]
       }
        pageClass[attr][element]['name'] = cloneOrigin[attr][element]
     });
    }
  }
  return pageClass;
}
// 整理后台路由
function getRoutes(userInfo,$root) {
  let allowedRouter = [];
  //将菜单数据转成多维数组格式
  let arrayMenus = userInfo;
  //将多维数组转成对象格式
  let hashMenus = {};
  let setMenu2Hash = function(array, base) {
    array.map(key => {
      if (key.path) {
        let hashKey = ((base ? base + "/" : "") + key.path.replace(
          /^\//,
          ""
        ));
        hashMenus["/" + hashKey] = true;
        if (Array.isArray(key.children)) {
          setMenu2Hash(key.children, hashKey);
        }
      }
    });
  };
  setMenu2Hash(arrayMenus);
  //全局挂载hashMenus，用于实现路由守卫
  $root.hashMenus = hashMenus;
  //筛选本地路由方法
  let findLocalRoute = function(array, base) {
    let replyResult = [];
    array.forEach(function(route) {
      let pathKey =(base ? base + "/" : "/") + route.path.replace(
        /^\//,
        ""
      );
      if (hashMenus[pathKey]) {
        if (Array.isArray(route.children)) {
          route.children = findLocalRoute(route.children, pathKey);
        }
        replyResult.push(route);
      }
    });
    if (base) {
      return replyResult;
    } else {
      allowedRouter = allowedRouter.concat(replyResult);
    }
  };
  findLocalRoute(originPath);
  return allowedRouter;
}
// 获得真实路由
function extendRoutes(allowedRouter,$root,$router) {
  console.log(allowedRouter)
  let actualRouter = _.cloneDeep(allowedRouter);
  actualRouter.map(e => {
    //为动态路由添加独享守卫
    return (e.beforeEnter = function(to, from, next) {
      if ($root.hashMenus[to.path]) {
        next();
      } else {
        next("/403");
      }
    });
  });
  originPath = actualRouter;
  //注入路由
  $router.addRoutes(
    originPath.concat([
      {
        path: "*",
        redirect: "/404"
      }
    ])
  );
}
// 得到后台返回的菜单数据,并生成路由的列表
function dealMenuData(data) {
  let menuData = [];
  data.forEach((item ) => {
    if (!item.parentId) {
      // delete item[parentId];
      menuData.push(item)
  }
  })
  const findChildren = (parentArr) => {
      if (parentArr.length) {
          parentArr.forEach( (parentNode) => {
              data.forEach( (node) => {
                  if (parentNode.id === node.parentId) {
                      if (parentNode.children) {
                          parentNode.children.push(node)
                      } else {
                          parentNode.children = [node];
                      }
                  }
              })
              if (parentNode.children) {
                  findChildren(parentNode.children);
              }
          })
      }
  }
  findChildren(menuData)
  return menuData;
}
// 过滤权限路由，生成权限路由
function filtersRouter(data){

}

export default app
