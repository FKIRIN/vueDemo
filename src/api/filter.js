import request from '@/utils/request'

export const filter = (filterKeyword) => {
  return request({
    url: `/gcl/data/filter/queryCommon/${filterKeyword}`,
    methods:'get',
  })
}
