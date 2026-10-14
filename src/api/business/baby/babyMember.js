import request from '@/utils/request'

// 查询宝宝与用户关系列表
export function listBabyMember(query) {
  return request({
    url: '/baby/babyMember/list',
    method: 'get',
    params: query
  })
}

// 查询宝宝与用户关系详细
export function getBabyMember(id) {
  return request({
    url: '/baby/babyMember/' + id,
    method: 'get'
  })
}

// 新增宝宝与用户关系
export function addBabyMember(data) {
  return request({
    url: '/baby/babyMember',
    method: 'post',
    data: data
  })
}

// 修改宝宝与用户关系
export function updateBabyMember(data) {
  return request({
    url: '/baby/babyMember',
    method: 'put',
    data: data
  })
}

// 删除宝宝与用户关系
export function delBabyMember(id) {
  return request({
    url: '/baby/babyMember/' + id,
    method: 'delete'
  })
}
