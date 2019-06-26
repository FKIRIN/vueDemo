import request from '@/utils/request'

export const role = () => {
  return request({
    url: '/hportal/const',
    methods:'get',
  })
}

export const RoleMenus = () => {
  return request({
    url: '/gcl/app/menu/selectRoleMenus',
    methods:'get'
  })
}

export const routerMenue = () =>{
  return request({
    url: '/gcl/app/menu/selectFullRoleMenus',
    method: 'get'
  })
}

export const autoIframeLogin = (da1) => {
  return request({
    url: "/trusted",
    method: "post",
    data: da1,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  })
}
