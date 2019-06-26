import {login ,autoLogin,tableauName} from '@/api/login'
import Qs from 'qs'
import {getParame} from '@/utils/dealUrl'
import {autoIframeLogin} from '@/api/app'

const userMessage = {
  state: {
  },
  mutations:{
  },
  actions:{
    //用户名密码登陆
    Login({ commit }, userInfo){
      return new Promise((resolve, reject ) => {
        login(userInfo).then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    //使用code自动登录
    autoLogin({ commit } ){
      let code = getParame("code");
      return new Promise((resovle, reject) => {
        autoLogin(code).then( response => {
          const data = response.data
          console.log(data)
          resovle(data)
        }).catch( error => {
          reject(error)
        })
      })
    },
    //自动登录iframe
    autoIframeLogin({ commit } ){

      return new Promise((resovle,reject) => {
        async function autoIframe(){
          const tableaueUser = await tableauName()
          let da1 = Qs.stringify({
            username: tableaueUser.rows[0].tableauUser,
            // server: "http://"+tableaueUser.rows[0].tableauServer
            server:process.env.TABLEAU_IP
          });
          const iframeMessage = await autoIframeLogin(da1)
          return iframeMessage
        }
        autoIframe()
        .then(res => {
          if (res && res != -1) {
            let iframeSrc = `${process.env.TABLEAU_IP}/trusted/${
              res
            }/views/_4/1`;
            let iframeString =`<iframe hidden src="${iframeSrc}" frameborder="0"></iframe>`
            document.getElementById("iframeLogin").innerHTML = iframeString
          } else {
            console.log("ifrmaeAutologin net error");
          }
          resovle()
        })
        .catch(error => {
          console.log(error)
          reject(error)
        })
      })
    }
  }
}

export default userMessage

