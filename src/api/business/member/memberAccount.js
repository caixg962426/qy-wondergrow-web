import request from '@/utils/request'

// 查询小程序用户列表
export function listMemberAccount(query) {
  return request({
    url: '/member/memberAccount/list',
    method: 'get',
    params: query
  })
}

// 查询小程序用户详细
export function getMemberAccount(userId) {
  return request({
    url: '/member/memberAccount/' + userId,
    method: 'get'
  })
}

// 新增小程序用户
export function addMemberAccount(data) {
  return request({
    url: '/member/memberAccount',
    method: 'post',
    data: data
  })
}

// 修改小程序用户
export function updateMemberAccount(data) {
  return request({
    url: '/member/memberAccount',
    method: 'put',
    data: data
  })
}

// 删除小程序用户
export function delMemberAccount(userId) {
  return request({
    url: '/member/memberAccount/' + userId,
    method: 'delete'
  })
}
