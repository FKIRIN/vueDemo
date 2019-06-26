import request from '@/utils/request'

export const login = (data) => {
  return request({
    url: "/res/index",
    method: "post",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
    },
    data:data
  })
}

export const autoLogin = (code) =>{
  return request({
    url: `/res/mobile/login?code=${code}`,
    method:'get',
  })
}

export const tableauName = () => {
  return request({
    url: '/gcl/tableau/user',
    methods:'get'
  })
}
