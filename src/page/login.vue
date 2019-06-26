<template>
<div class="loginContain" style="height:100vh;background:#f5f6f8">
  <div class="loginicon">
        <img src="../assets/login/logo.png" alt="">
   </div>
    <div class="loginForm">
      <group >
         <x-input class="username" :title="peopleSvg" v-model="userName" placeholder="请输入用户名" placeholder-align="right"></x-input>
         <x-input type="password" class="userpw" :title="loginPawSvg" v-model="userPassword" placeholder="请输入登陆密码" placeholder-align="right"></x-input>
      </group>
      <div style="padding:3rem;">
         <x-button class="loginButton"  @click.native="handleLogin()" :gradients="['#FFFEFF', '#D7FFFE']">Login</x-button>
      </div>
    </div>
  <alert v-model="isShowAlert" :title="alterTitle" @on-show="onShowAlert" > {{alertMesg}}</alert>
</div>
</template>
<script>
import { XHeader, XInput, XButton, Group, Alert } from "vux";
import vue from "vue";
import axios from "axios";
import Qs from "qs";
import { debug } from "util";
import _ from "lodash";
import { setTimeout } from "timers";
import loginPawSvg from "../assets/login/password.svg";
import peopleSvg from "../assets/login/people.svg";
import { firstPagePath } from '@/utils/appPath'

export default {
  data() {
    return {
      userName: "",
      userPassword: "",
      isShowAlert: false,
      alterTitle: "",
      alertMesg: "",
      peopleSvg: `<img style="width:1.5rem;" src="${peopleSvg}" alt="">`,
      loginPawSvg: `<img style="width:1.5rem;" src="${loginPawSvg}" alt="">`
    };
  },
  components: {
    XHeader,
    XInput,
    XButton,
    Group,
    Alert
  },
  methods: {
    handleLogin() {
      let that = this;
      let thatVue = {};
      thatVue.router = this.$router;
      thatVue.root = this.$root;
      let userData = Qs.stringify({
        username: this.userName,
        password: this.userPassword
      });
      async function login() {
        const logMes = await that.$store.dispatch("Login", userData);
        const rolMes = await that.$store.dispatch("getRole");
        return rolMes;
      }
      login()
        .then(response => {
          if (_.isNil(response.rows[0].userName)) {
            this.isShowAlert = true;
            this.alterTitle = "输入错误";
            this.alertMesg = "亲！检查下用户名和密码哦！";
          } else {
            that.$store.dispatch("setRouterMenue", thatVue).then(()=>{
               that.$store
              .dispatch("autoIframeLogin")
              .then(() => {
                // 手动登陆成功增加第一次进入判定
                let avilableMenue = that.$store.getters.avilableMenue;
                let firstPageList = []
                // 自动登录成功增加第一次进入判定
                sessionStorage.setItem("loadingTime", "first");
                avilableMenue.forEach(element => {
                  if(element.children.length > 0){
                    firstPageList.push(element)
                  }
                });
                if (firstPageList.length > 0 ) {
                  let routerAvilable = firstPageList;
                  let firstpage = firstPagePath(routerAvilable)
                  that.$router.push({ path: firstpage });
                } else {
                  that.$router.push({ path: "/" });
                }
              })
              .catch(error => {
                that.$router.push({ path: "/login" });
              });
            }).catch(error =>{
              console.log('无法获取路由')
            })
          }
        })
        .catch(error => {
          this.isShowAlert = true;
          this.alterTitle = "登陆出错";
          this.alertMesg = "亲！检查下网络和vpn哦！";
        });
    },
    onShowAlert() {
      setTimeout(() => {
        this.isShowAlert = false;
        this.alterTitle = "";
        this.alertMesg = "";
      }, 2000);
    }
  }
};
</script>
<style>
.logo {
  background-image: url(../assets/header/logo.png);
  width: 4rem;
  height: 2rem;
  display: block;
  background-repeat: no-repeat;
  background-size: 100% 100%;
}
.loginContain {
  background: radial-gradient(
      0% 100%,
      ellipse cover,
      rgba(104, 128, 138, 0.4) 10%,
      rgba(138, 114, 76, 0) 40%
    ),
    linear-gradient(
      to bottom,
      rgba(57, 173, 219, 0.25) 0%,
      rgba(42, 60, 87, 0.4) 100%
    ),
    linear-gradient(to top, #96fbc4 0%, #f9f586 100%) !important;
}
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
input:-webkit-autofill:active {
  -webkit-transition-delay: 99999s;
  -webkit-transition: color 99999s ease-out, background-color 99999s ease-out;
}
.loginForm {
  position: absolute;
}
.weui-input {
  background: rgba(255, 255, 255, 0);
}
.vux-no-group-title {
  background: rgba(255, 255, 255, 0.4) !important;
}
.loginicon {
  position: absolute;
  width: 100vw;
  text-align: center;
  margin-top: 10vh;
}
.loginForm {
  left: 0px;
  right: 0px;
  top: 0px;
  bottom: 0px;
  margin: auto;
  width: 19rem;
  height: 11rem;
  padding: 30px;
}
.loginButton {
  border-radius: 99px !important;
  color: #6e9e93 !important;
}
.loginButton :active {
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1);
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.25);
  background: linear-gradient(
    -225deg,
    #dfffcd 0%,
    #90f9c4 48%,
    #39f3bb 100%
  ) !important;
}
.weui-input {
  height: 2rem !important;
}
</style>
