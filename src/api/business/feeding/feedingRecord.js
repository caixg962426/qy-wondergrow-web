import request from '@/utils/request'

// 查询喂养记录列表
export function listFeedingRecord(query) {
  return request({
    url: '/feeding/feedingRecord/list',
    method: 'get',
    params: query
  })
}

// 查询喂养记录详细
export function getFeedingRecord(recordId) {
  return request({
    url: '/feeding/feedingRecord/' + recordId,
    method: 'get'
  })
}

// 新增喂养记录
export function addFeedingRecord(data) {
  return request({
    url: '/feeding/feedingRecord',
    method: 'post',
    data: data
  })
}

// 修改喂养记录
export function updateFeedingRecord(data) {
  return request({
    url: '/feeding/feedingRecord',
    method: 'put',
    data: data
  })
}

// 删除喂养记录
export function delFeedingRecord(recordId) {
  return request({
    url: '/feeding/feedingRecord/' + recordId,
    method: 'delete'
  })
}
