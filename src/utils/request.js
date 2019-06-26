import axios from 'axios'

const service = axios.create({
  timeout: 5000 //请求时间超时
})

service.interceptors.request.use(config => {
  return config
}, error => {
  console.log(error)
  Promise.reject(error)
})

// response拦截器
service.interceptors.response.use(
  response => {
    // code 非200 抛出异常
    const res = response.data
    if (res.code >= 200 && res.code < 300) {
      let that = this
      this.$vux.alert.show({
        title: '请求失败',
        content: `${res.message}`,
        onShow() {
          setTimeout(that.$vux.alert.hide(), 2000)
        },
      })
      // 500 错误集合
      if (res.code >= 500 && res.code <600) {
        this.$vux.alert.show({
          title: '请求超时',
          content: `${res.message}`,
          onShow() {
            setTimeout(that.$vux.alert.hide(), 2000)
          },
        }).then(() => {
          store.dispatch('FedLogOut').then(() => {
            location.reload() // 为了重新实例化vue-router对象 避免bug
          })
        })
      }
      return Promise.reject('error')
    }else{
      return response.data
    }
  },
  error => {
    console.log('err' + error)// for debug
    this.$vux.alert.show({
      title: '请求失败',
      content: `${error.message}`,
      onShow() {
        setTimeout(that.$vux.alert.hide(), 2000)
      },
    })
    return Promise.reject(error)
  }
)
export default service
