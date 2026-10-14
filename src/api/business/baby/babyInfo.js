import request from '@/utils/request'

// 查询宝宝信息列表
export function listBabyInfo(query) {
  return request({
    url: '/baby/babyInfo/list',
    method: 'get',
    params: query
  })
}

// 查询宝宝信息详细
export function getBabyInfo(babyId) {
  return request({
    url: '/baby/babyInfo/' + babyId,
    method: 'get'
  })
}

// 新增宝宝信息
export function addBabyInfo(data) {
  return request({
    url: '/baby/babyInfo',
    method: 'post',
    data: data
  })
}

// 修改宝宝信息
export function updateBabyInfo(data) {
  return request({
    url: '/baby/babyInfo',
    method: 'put',
    data: data
  })
}

// 删除宝宝信息
export function delBabyInfo(babyId) {
  return request({
    url: '/baby/babyInfo/' + babyId,
    method: 'delete'
  })
}
