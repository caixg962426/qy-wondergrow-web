import request from '@/utils/request'

// 查询宝宝使用奶粉关联列表
export function listBabyFormula(query) {
  return request({
    url: '/baby/babyFormula/list',
    method: 'get',
    params: query
  })
}

// 查询宝宝使用奶粉关联详细
export function getBabyFormula(id) {
  return request({
    url: '/baby/babyFormula/' + id,
    method: 'get'
  })
}

// 新增宝宝使用奶粉关联
export function addBabyFormula(data) {
  return request({
    url: '/baby/babyFormula',
    method: 'post',
    data: data
  })
}

// 修改宝宝使用奶粉关联
export function updateBabyFormula(data) {
  return request({
    url: '/baby/babyFormula',
    method: 'put',
    data: data
  })
}

// 删除宝宝使用奶粉关联
export function delBabyFormula(id) {
  return request({
    url: '/baby/babyFormula/' + id,
    method: 'delete'
  })
}
